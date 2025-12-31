import CreatedApplications from "@/components/applications/CreatedApplications";
import CreatedJobs from "@/components/jobs/CreatedJobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

function MyJobs() {

  const { user, isLoaded } = useUser();

  if (!isLoaded) return <BarLoader width={"100%"} color="#36d7b7" />

  return (
    <div className="lg:px-40 px-4 py-8">
      <h1 className='gradient-title font-extrabold text-4xl sm:text-5xl md:text-6xl text-center pb-6 sm:pb-8'>
        {user?.unsafeMetadata?.role === "candidate" ?
          "My Applications"
          : "My Jobs"}
      </h1>
      {user?.unsafeMetadata?.role === "candidate" ? (
        <CreatedApplications />
      ) : (
        <CreatedJobs />
      )}
    </div>
  )
}

export default MyJobs