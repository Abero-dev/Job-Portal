import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const schema = z.object({
    name: z.string().min(1, {
        message: "Name is required"
    }),
    logo: z
        .any()
        .refine(
            file => file[0] &&
                (
                    file[0].type === "image/png" ||
                    file[0].type === "image/jpg" ||
                    file[0].type === "image/jpeg" ||
                    file[0].type === "image/webp"
                ),
            { message: "Only png, jpg, webp or jpeg images are allowed" }
        )
})

function AddCompanyDrawer(fetchCompanies: any) {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = (data: any) => {

    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button type="button" variant={"blue"} className='w-full lg:w-40'>
                    Add company
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add a new company</DrawerTitle>
                </DrawerHeader>
                <form className='flex lg:flex-row flex-col gap-4 p-4 pb-0'>
                    <Input placeholder="Company name" {...register("name")} />
                    <Input
                        type="file"
                        accept='image/*'
                        className='file:text-gray-500'
                        {...register("logo")}
                    />
                    <Button
                        type='button'
                        onClick={handleSubmit(onSubmit)}
                        variant={"blue"}
                        className='lg:w-40'
                    >
                        Add
                    </Button>
                </form>

                {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                {errors.logo && <p className='text-red-500'>File must be an image</p>}

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default AddCompanyDrawer