import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Baseurl } from "../../services api/baseurl";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/fetaures/authSlice";

export default function Login() {
  const usegatReg = useNavigate();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userlogin, setuserlogin] = useState({
    email: "",
    password: "",
  });

  // handle userlogin data
  const hadleuserlogin = (e) => {
    const { name, value } = e.target;
    setuserlogin({ ...userlogin, [name]: value });
  };

  // handle useloginSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: userlogin.email,
      password: userlogin.password,
    };

    try {
      const resp = await axios.post(`${Baseurl}/api/Auth/login`, userData, {});
      const data = resp.data;
      console.log(data.user);
      console.log(data.token);

      if (resp.status === 200) {
        toast.success(data.message);
        setuserlogin({
          email: "",
          password: "",
        });
        dispatch(setCredentials({ user: data.user, token: data.token }));

        navigate("/");
      }
    } catch (error) {
      if (error && error.response && error.response.data) {
        toast.error(error.response.data.message);
      }
      console.log(error);
    }
  };

  // register btn click in register

  const handlReister = () => {
    usegatReg("/register");
  };

  //  const loginHome = ()=>{
  //   Homepage('/Home')
  //  }

  return (
    <div>
      <div className="bg-blue-400 font-[sans-serif]">
        <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
          <div className="max-w-md w-full">
            <div className="p-8 rounded-2xl bg-gray-800 shadow">
              <h2 className="text-white text-center text-2xl font-bold">
                Login
              </h2>
              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-white text-lg mb-2 block">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="email"
                      value={userlogin.email}
                      onChange={hadleuserlogin}
                      type="text"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter user name"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white text-lg mb-2 block">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      value={userlogin.password}
                      onChange={hadleuserlogin}
                      type="password"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                <div className="!mt-8">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Login
                  </button>
                </div>
                <p className="text-white text-sm !mt-8 text-center">
                  Don&#39;t have an account?{" "}
                  <button className="text-blue-400" onClick={handlReister}>Click me</button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
