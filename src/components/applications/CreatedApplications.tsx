import { getApplications } from "@/api/apiApplications"
import { useJobs } from "@/hooks/useJobs"
import { useUser } from "@clerk/clerk-react"
import { useEffect } from "react";
import ApplicationCard from "./ApplicationCard";
import { BarLoader } from "react-spinners";

function CreatedApplications() {

    const { user } = useUser();

    const {
        loading: loadingApplications,
        data: applications,
        fn: fnApplications
    } = useJobs(getApplications, {
        user_id: user?.id
    })

    useEffect(() => {
        fnApplications();
    }, [])

    if (loadingApplications) return <BarLoader width={"100%"} color="#36d7b7" />

    return (
        <div>
            {applications?.length > 0 ?
                <div>
                    {applications?.map((application: any) => {
                        return (
                            <ApplicationCard key={application.id} application={application} isCandidate />
                        )
                    })}
                </div>
                :
                <div className="text-center">No applications found</div>
            }
        </div>
    )
}

export default CreatedApplications