import { useUser } from "@clerk/clerk-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import type { Company } from "@/hooks/types/companies/types";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { saveJob } from "@/api/apiJobs";
import { useJobs } from "@/hooks/useJobs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type JobCardProps = {
    job: {
        id: number,
        title: string,
        location: string,
        description: string,
        requirements: string,
        company: Company
    },
    isMyJob: boolean | undefined,
    savedInit: boolean | undefined,
    onJobSaved: Function | undefined
}
function JobCard({ job, isMyJob = false, savedInit = false, onJobSaved = () => { } }: JobCardProps) {

    const [saved, setSaved] = useState<boolean>(savedInit)

    const { data: savedJob, loading: loadingSavedJob, fn: fnSavedJob } = useJobs(saveJob, null);

    const { user } = useUser();

    const handleSaveJob = async () => {
        if (!user) {
            toast.error("Please sign in to save jobs");
            return;
        }

        await fnSavedJob({
            alreadySaved: saved,
            saveData: {
                user_id: user.id,
                job_id: job.id
            }
        });
        onJobSaved();
    }

    useEffect(() => {
        if (savedJob === null) {
            setSaved(false);
        } else if (Array.isArray(savedJob)) {
            setSaved(savedJob.length > 0);
        }
    }, [savedJob]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between font-bold">
                    {job.title}
                    {isMyJob && <Trash2Icon fill="red" size={18} className="text-red-300 cursor-pointer" />}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
                <div className="flex justify-between">
                    {job.company &&
                        <img src={job.company.logo_url} alt={job.company.name} className="h-6" />
                    }
                    <div className="flex gap-2 items-center">
                        <MapPinIcon size={15} /> {job.location}
                    </div>

                </div>
                <hr />
                {job.description}
            </CardContent>
            <CardFooter className="flex gap-2 ">
                <Link to={`/job/${job.id}`} className="flex-1">
                    <Button variant={"secondary"} className="w-full">
                        More Details
                    </Button>
                </Link>
                {!isMyJob && (
                    <Button
                        variant={"outline"}
                        className="w-15"
                        onClick={handleSaveJob}
                        disabled={loadingSavedJob}
                    >
                        {
                            saved ?
                                <Heart size={20} stroke="red" fill="red" />
                                :
                                <Heart size={20} />
                        }

                    </Button>
                )}

            </CardFooter>
        </Card>
    )
}

export default JobCard