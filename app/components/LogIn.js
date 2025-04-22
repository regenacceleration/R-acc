"use client";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase.js";
import { BtnLoader } from "./Loader";
import { useRouter } from "next/navigation";
import { useNotification } from "../hooks/useNotification";
import LogInHeader from "./LogInHeader.js";


export function LogIn() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showMessage } = useNotification();

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("")

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!validateForm()) return;
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                setLoading(false);
                console.error('Login error:', error.message);
                setError(error.message)
                return;
            }
            setLoading(false);
            showMessage({
                type: "success",
                value: "Login Successfully",
            });
            setFormData({
                email: "",
                password: ""
            });
            router.push("/form-details");
        } catch (error) {
            console.log("Error:", error);
        }
    };

    return (
        <div className="flex flex-col w-full h-screen bg-gray-50">
            <LogInHeader />
            <div className="flex flex-col h-full items-center justify-center">
                <p className="font-normal py-4 font-primary text-[18px] text-[#000000]">LOGIN</p>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 text-black">
                    <div>
                        <label className=" font-normal font-primary text-[13px] text-[#000000]">EMAIL</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="  w-full  outline-none font-primary border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  "
                        />
                        {errors.email && <p className="text-red-500 text-sm ">{errors.email}</p>}

                    </div>
                    <div className="w-full">
                        <label className=" font-normal font-primary text-[13px]  text-[#000000]">PASSWORD</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-gray-50 outline-none font-primary border-[#D5D5D5]  border-b-[1px]    "
                        />
                        {errors.password && <p className="text-red-500 text-sm ">{errors.password}</p>}
                        <p className="text-red-500 text-sm ">{error}</p>
                    </div>
                    <div className="flex w-full py-4  gap-8 justify-center items-center">
                        <button type="submit"
                            disabled={loading}
                            className="text-[#FF0000] flex items-center justify-center gap-3 font-normal font-primary text-[13px]">
                            SUBMIT
                            {loading ? <BtnLoader /> : null}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}
