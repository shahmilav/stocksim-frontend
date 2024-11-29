import {  redirect } from "@remix-run/node";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = await fetch("http://localhost:3000/user", {
    headers: request.headers,
    credentials: "include",
  });

  if (response.ok) {
    return redirect("/home");
  } else {
    return null;
  }
};
export default function Index() {
  return (
    <div>
      <h1>Home</h1>
      <a href="http://localhost:3000/login">Sign in</a>
    </div>
  );
}
