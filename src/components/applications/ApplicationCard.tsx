import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useJobs } from "@/hooks/useJobs";
import { updateApplicationsStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function ApplicationCard({ application, isCandidate }: { application: any, isCandidate: boolean }) {
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = application?.resume;
        link.target = "_blank";
        link.click();
    }

    const {
        loading: loadingHiringStatus,
        fn: fnHiringStatus
    } = useJobs(updateApplicationsStatus, { job_id: application.job_id })

    const handleStatusChange = (status: string) => {
        fnHiringStatus({
            job_id: application.job_id,
            status
        });
    }

    return (
        <Card>
            {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
            <CardHeader className="flex justify-between items-center">
                <CardTitle>
                    {isCandidate
                        ? `${application?.job?.title} at ${application?.job?.company?.name}`
                        : application?.name}
                </CardTitle>
                <Download size={20} onClick={handleDownload} className="cursor-pointer" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-y-3 md:flex-row justify-between">
                    <div className="flex items-center gap-x-2">
                        <BriefcaseBusiness size={20} />
                        {application?.experience} years of experience
                    </div>
                    <div className="flex items-center gap-x-2">
                        <School size={20} />
                        {application?.education}
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Boxes size={20} />
                        Skills: {application?.skills}
                    </div>
                </div>
            </CardContent>
            <hr />
            <CardFooter className="flex justify-between items-center">
                <span>{new Date(application?.created_at).toLocaleString()}</span>
                {isCandidate ? (
                    <span className="capitalize font-bold">Status: {application?.status}</span>
                ) : (
                    <Select
                        onValueChange={handleStatusChange}
                        defaultValue={application.status}
                    >
                        <SelectTrigger className='w-52'>
                            <SelectValue placeholder="Application Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                value="applied"
                            >
                                Applied
                            </SelectItem>
                            <SelectItem
                                value="interviewing"
                            >
                                Interviewing
                            </SelectItem>
                            <SelectItem
                                value="hired"
                            >
                                Hired
                            </SelectItem>
                            <SelectItem
                                value="rejected"
                            >
                                Rejected
                            </SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </CardFooter>
        </Card>
    )
}

export default ApplicationCard