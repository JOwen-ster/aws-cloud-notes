import { redirect } from "next/navigation"

// just here in case a user id wasnt in the website url since nothing should be displayed on the edit page if no user id is present
export default function EditIndexPage() {
  redirect("/")
}