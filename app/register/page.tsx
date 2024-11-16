import { signup } from "./actions";
import RegisterForm from "@/components/register-form";

export const metadata = {
	title: "Register - Template",
	description: "Register",
};

export default async function Page() {
	return (
		<>
			<div className="flex items-center justify-center bg-black h-[100vh] text-white">
				<RegisterForm serverAction={signup} />
			</div>
		</>
	);
}