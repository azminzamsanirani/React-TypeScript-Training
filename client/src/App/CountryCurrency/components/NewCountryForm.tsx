import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCountry } from "../server/create";
import "./style/NewCountryForm.css";

interface CountryData {
  countryName: string;
  currencyValue: string;
}

const countrySchema = z.object({
  countryName: z.string().min(1, { message: "Country cannot be empty" }),
  currencyValue: z
    .string()
    .min(1, { message: "Value cannot be empty" })
    .refine(
      (value) => {
        const numericValue = parseInt(value.replace(/,/g, ""), 10);
        return !isNaN(numericValue) && numericValue <= 10000;
      },
      {
        message: "Currency value must be less than or equal to 10,000",
      }
    ),
});

type ValidationSchema = z.infer<typeof countrySchema>;

interface NewCountryFormProps {
  onNewCountry: (newCountry: CountryData) => void;
}

const NewCountryForm: React.FC<NewCountryFormProps> = ({ onNewCountry }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(countrySchema),
  });

  const createCountryMutation = useCreateCountry();

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      await createCountryMutation.mutateAsync(data);
      console.log("Country created successfully!");
      onNewCountry(data);
      setValue("countryName", "");
      setValue("currencyValue", "");
    } catch (error) {
      console.error("Error submitting new country:", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="NewCountryFormContainer"
      >
        <label>
          Country:
          <input
            type="text"
            {...register("countryName")}
            className={`InputForm ${errors.countryName && "error"}`}
          />
        </label>
        <label>
          Value:
          <input
            type="text"
            {...register("currencyValue")}
            className={`InputForm ${errors.currencyValue && "error"}`}
          />
        </label>
        <button className="AddButton" type="submit">
          Add
        </button>
      </form>
      <div className="WarningMessage">
        {errors.countryName && (
          <p className="ErrorMessage" style={{ marginLeft: "65px" }}>
            {errors.countryName.message}
          </p>
        )}
        {errors.currencyValue && (
          <p
            className="ErrorMessage"
            style={{
              marginLeft: errors.countryName ? "70px" : "260px",
            }}
          >
            {errors.currencyValue.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default NewCountryForm;
