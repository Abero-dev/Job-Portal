import { getMyJobs } from "@/api/apiJobs";
import { useJobs } from "@/hooks/useJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import JobCard from "./JobCard";

function CreatedJobs() {

    const { user } = useUser();

    const {
        data: myJobs,
        fn: fnMyJobs
    } = useJobs(getMyJobs, {
        user_id: user?.id
    })

    useEffect(() => {
        fnMyJobs();
    }, [])

    return (
        <div>
            {myJobs?.length > 0 ?
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                    {myJobs?.map((job: any) => {
                        return (
                            <JobCard key={job.id} job={job} isMyJob={true} savedInit={undefined} onJobSaved={undefined} />
                        )
                    })}
                </div>
                :
                <div className="text-center">No jobs found</div>
            }
        </div>
    )
}

export default CreatedJobs