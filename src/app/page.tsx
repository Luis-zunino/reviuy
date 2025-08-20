import { redirect } from "next/navigation";

const RootPage = () => {
  redirect("/home");
  return null;
};

export default RootPage;
