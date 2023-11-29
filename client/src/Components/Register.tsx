// Register.tsx
import React from "react";
import "../Style/Register.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateUser } from "../Database/CreateUser";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  position: string;
  country: string;
}

const schema = z.object({
  id: z.string().refine((value) => /^\d{4}$/.test(value), {
    message: "ID must be exactly 4 numeric characters",
  }),
  name: z.string().min(1).max(100),
  position: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
});

interface RegisterProps {
  onNewUser: (newUser: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onNewUser }) => {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<User>({
    resolver: zodResolver(schema),
  });

  const createUserMutation = useCreateUser();

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      await createUserMutation.mutateAsync(data);
      console.log("User created successfully!");
      onNewUser(data);
      reset();
      navigate("/login");
    } catch (error) {
      console.error("Error submitting new user:", error);
    }
  };

  const handleCancel = () => {
    navigate("/login");
  }

  return (
    <div className="RegisterContainer">
      <div className="RegisterBox">
        <div className="RegisterHeader">Register</div>
        <div>
          <form style={{ padding: "10px 0" }} onSubmit={handleSubmit(onSubmit)}>
            <div className="FormContainer">
              <div className="FormField">
                <label htmlFor="UserID">
                  ID:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <input type="text" id="UserID" {...register("id")} />
              </div>
              {errors.id && <span className="RegisterErrorMessage">{errors.id.message}</span>}

              <div className="FormField">
                <label htmlFor="Name">
                  Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <input type="text" id="Name" {...register("name")} />
              </div>
              {errors.name && <span className="RegisterErrorMessage">{errors.name.message}</span>}

              <div className="FormField">
                <label htmlFor="Position">
                  Position:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <input type="text" id="Position" {...register("position")} />
              </div>
              {errors.position && <span className="RegisterErrorMessage">{errors.position.message}</span>}

              <div className="FormField">
                <label htmlFor="Country">
                  Country:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <input type="text" id="Country" {...register("country")} />
              </div>
              {errors.country && <span className="RegisterErrorMessage">{errors.country.message}</span>}
            </div>
            <div>
              <button type="submit" className="RegisterButton">
                Confirm
              </button>
              <button
                type="button"
                className="RegisterButton"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
