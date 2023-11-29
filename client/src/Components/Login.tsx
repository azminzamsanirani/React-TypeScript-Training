// Login.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import "../Style/Login.css";

interface User {
  id: number;
  name: string;
  position: string;
  country: string;
}

const fetchUsers = async () => {
  const response = await axios.get("http://localhost:3001/users");
  return response.data;
};

const schema = z.object({
  userId: z.string().nonempty("User ID is required"),
});

type FormData = z.infer<typeof schema>;

const Login: React.FC = () => {
  const navigate = useNavigate();

  const { data: usersData } = useQuery("users", fetchUsers);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const userExists = usersData?.some(
      (user: User) => user.id.toString() === data.userId
    );

    if (userExists) {
      console.log("Login success");
      navigate("/landing");
    } else {
      console.log("User not found");
      navigate("/register");
    }
  };

  return (
    <div className="LoginContainer">
      <div className="LoginBox">
        <div className="LoginHeader">Login</div>
        <div className="LoginForm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="UserID">ID : </label>
            <input
              className="InputField"
              type="text"
              id="UserID"
              {...register("userId")}
            />
            {errors.userId && (
              <p className="LoginErrorMessage">{errors.userId.message}</p>
            )}
            <div className="ButtonContainer">
              <button className="ActionButton" type="submit">
                Confirm
              </button>
              <button
                className="ActionButton"
                type="button"
                onClick={() => navigate("/cancel")}
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

export default Login;
