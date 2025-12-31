import { getApplications } from "@/api/apiApplications"
import { useJobs } from "@/hooks/useJobs"
import { useUser } from "@clerk/clerk-react"
import { useEffect } from "react";
import ApplicationCard from "./ApplicationCard";

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

    return (
        <div>
            {applications?.map((application: any) => {
                return (
                    <ApplicationCard key={application.id} application={application} isCandidate />
                )
            })}
        </div>
    )
}

export default CreatedApplications