import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod'
import { State, Country } from 'country-state-city'
import { useJobs } from '@/hooks/useJobs';
import { getAllCompanies } from '@/api/apiCompanies';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';

// Actualizar el schema para aceptar el valor especial
const schema = z.object({
  title: z.string().min(1, {
    message: "Title is required"
  }),
  description: z.string().min(1, {
    message: "Description is required"
  }),
  location: z.string().refine(val => val !== "unselected", {
    message: "Location is required"
  }),
  company_id: z.string().refine(val => val !== "unselected", {
    message: "Company is required"
  }),
  requirements: z.string().min(1, {
    message: "Requirements are required"
  }),
})

function PostJob() {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "unselected",
      company_id: "unselected",
      requirements: ""
    },
    resolver: zodResolver(schema),
  });

  const targetCountries = ['US', 'UY', 'ES', 'DE', 'RU', 'AU', 'IN', 'CA'];

  const statesList = useMemo(() => {
    let list: any[] = [];

    targetCountries.forEach(countryCode => {
      const countryStates = State.getStatesOfCountry(countryCode);
      if (countryStates && countryStates.length > 0) {
        const statesWithCountry = countryStates.map(state => ({
          ...state,
          countryCode: countryCode,
          countryName: Country.getCountryByCode(countryCode)?.name || countryCode,
          displayValue: state.name,
          displayLabel: `${state.name} (${Country.getCountryByCode(countryCode)?.name || countryCode})`
        }));
        list = [...list, ...statesWithCountry];
      }
    });

    return list;
  }, [targetCountries]);

  const getStateLabel = (stateName: string) => {
    if (stateName === "unselected") return "Select a location";
    const state = statesList.find(s => s.displayValue === stateName);
    return state ? state.displayLabel : stateName;
  };

  const { isLoaded, user } = useUser();

  const {
    data: companies,
    loading: loadingCompanies,
    fn: fetchCompanies
  } = useJobs(getAllCompanies);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  }

  return (
    <div className='lg:px-40 px-4'>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>Post a Job</h1>

      <form
        className='flex flex-col gap-4 p-4 pb-0'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input placeholder='Job Title' {...register("title")} />
        {errors.title && <p className='text-red-500'>{errors.title.message}</p>}

        <Textarea placeholder='Job Description' {...register("description")} />
        {errors.description && <p className='text-red-500'>{errors.description.message}</p>}

        <div className='flex items-center gap-4'>
          <Controller
            name='location'
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="h-12 w-[50%]">
                  <SelectValue placeholder='Select a location'>
                    {getStateLabel(field.value)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {statesList.map((state) => (
                      <SelectItem
                        key={`${state.countryCode}-${state.isoCode}`}
                        value={state.displayValue}
                      >
                        {state.displayLabel}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.location && <p className='text-red-500 text-sm'>{errors.location.message}</p>}

          <Controller
            name='company_id'
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="h-12 sm:h-11 flex-1 w-[50%]">
                  <SelectValue placeholder='Select a Company'>
                    {field.value === "unselected"
                      ? "Select a company"
                      : companies?.find((c: any) => c.id === field.value)?.name || field.value
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map((company: any) => (
                      <SelectItem
                        key={company.id}
                        value={company.name}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.company_id && <p className='text-red-500 text-sm'>{errors.company_id.message}</p>}
        </div>

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.requirements && <p className='text-red-500'>{errors.requirements.message}</p>}
        <Button
          type="submit"
          variant="blue"
          size="lg"
          className="mt-2"
        >
          Post Job
        </Button>
      </form>
    </div>
  )
}

export default PostJob;