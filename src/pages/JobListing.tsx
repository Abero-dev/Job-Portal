import { BarLoader } from 'react-spinners';
import { useJobs } from '../hooks/useJobs';
import { useEffect, useState, useMemo } from 'react';
import { getAllJobs, getSavedJobs } from '@/api/apiJobs';
import JobCard from '@/components/jobs/JobCard';
import { getAllCompanies } from '@/api/apiCompanies';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import { Select, SelectContent, SelectTrigger, SelectGroup, SelectValue, SelectItem } from '@/components/ui/select';
import { State, Country } from 'country-state-city'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useUser } from '@clerk/clerk-react';

function JobListing() {
  const [searchQuery, setSearchQuery] = useState<string | undefined>("")
  const [location, setLocation] = useState<string | undefined>("")
  const [company_id, setCompany_id] = useState<string | undefined>("")
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  const { user, isLoaded: userLoaded } = useUser();

  const { data: jobs, loading: loadingJobs, error: errorJobs, fn: fetchJobs } = useJobs(getAllJobs, { searchQuery, location, company_id });
  const { data: companies, loading: loadingCompanies, fn: fetchCompanies } = useJobs(getAllCompanies);

  const {
    data: savedJobsData,
    loading: loadingSavedJobs,
    fn: fetchSavedJobs
  } = useJobs(getSavedJobs, null);

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

  // Crear un Set de IDs de trabajos guardados para búsqueda rápida
  const savedJobIds = useMemo(() => {
    if (!savedJobsData) return new Set<number>();

    return new Set(
      savedJobsData
        .filter((savedJob: any) => savedJob.job && savedJob.job.id)
        .map((savedJob: any) => savedJob.job.id)
    );
  }, [savedJobsData]);

  // Filtrar trabajos para excluir los que ya están guardados
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];

    // Si hay usuario autenticado, filtrar trabajos guardados
    if (user && savedJobIds.size > 0) {
      return jobs.filter((job: any) => !savedJobIds.has(job.id));
    }

    // Si no hay usuario o no hay trabajos guardados, mostrar todos
    return jobs;
  }, [jobs, savedJobIds, user]);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(2);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);

    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Usar filteredJobs en lugar de jobs para la paginación
  const totalItems = filteredJobs?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs?.slice(startIndex, endIndex) || [];

  const clearFilters = () => {
    setLocation("");
    setCompany_id("");
    setSearchQuery("");
    setShowFilters(false);
    setCurrentPage(1);
  };

  const getStateLabel = (stateName: string) => {
    const state = statesList.find(s => s.displayValue === stateName);
    return state ? state.displayLabel : stateName;
  };

  const handleLocationChange = (value: string) => {
    if (value === "all") {
      setLocation("");
    } else {
      setLocation(value);
    }
    setCurrentPage(1);
  };

  const handleCompanyChange = (value: string) => {
    if (value === "all") {
      setCompany_id("");
    } else {
      setCompany_id(value);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  useEffect(() => {
    fetchCompanies();
  }, [])

  // Cargar trabajos guardados cuando el usuario esté listo
  useEffect(() => {
    if (userLoaded && user) {
      fetchSavedJobs();
    }
  }, [userLoaded, user]);

  // Función para refrescar trabajos guardados
  const refreshSavedJobs = () => {
    if (user) {
      fetchSavedJobs();
    }
  };

  useEffect(() => {
    fetchJobs();
    setCurrentPage(1);
  }, [searchQuery, location, company_id]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query: any = formData.get("search-query");
    if (query === null) fetchJobs()
    else setSearchQuery(query);
    setCurrentPage(1);
  }

  // Mensaje cuando no hay trabajos para mostrar
  const noJobsMessage = useMemo(() => {
    if (loadingJobs || loadingSavedJobs) return "";

    if (totalItems === 0) {
      if (user && savedJobIds.size > 0 && jobs && jobs.length > 0) {
        return "All available jobs have been saved. Check your saved jobs or try different filters.";
      }
      return "No jobs found matching your criteria";
    }

    return "";
  }, [loadingJobs, loadingSavedJobs, totalItems, user, savedJobIds, jobs]);

  return (
    <div className='px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-4 sm:py-6 md:py-8'>
      <h1 className='gradient-title font-extrabold text-4xl sm:text-5xl md:text-6xl text-center pb-6 sm:pb-8'>
        Latest Jobs
      </h1>

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <p className="text-sm sm:text-base">
          {user ? "Showing jobs you haven't saved yet" : "Showing all available jobs"}
        </p>
        {user && (
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href="/saved-jobs">View Saved Jobs ({savedJobIds.size})</a>
          </Button>
        )}
      </div>

      <form onSubmit={handleSearch} className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Search Jobs by Title.."
            name='search-query'
            className='h-12 sm:h-11 flex-1 px-4 text-md'
          />
          <Button
            type="button"
            variant="outline"
            className="h-12 sm:hidden flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
          </Button>
        </div>
        <Button variant={"blue"} type='submit' className='h-12 sm:h-11 w-full sm:w-auto text-md sm:px-6'>
          <Search size={18} className="sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </form>

      <div className="hidden sm:flex items-center gap-2 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <Select value={location} onValueChange={handleLocationChange}>
            <SelectTrigger className="h-12 sm:h-11 flex-1 min-w-50">
              <SelectValue placeholder='Filter by Location'>
                {location ? getStateLabel(location) : 'Filter by Location'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Locations</SelectItem>
                {statesList.map((state) => {
                  return (
                    <SelectItem
                      key={`${state.countryCode}-${state.isoCode}`}
                      value={state.displayValue}
                    >
                      {state.displayLabel}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={company_id} onValueChange={handleCompanyChange}>
            <SelectTrigger className="h-12 sm:h-11 flex-1 min-w-50">
              <SelectValue placeholder='Filter by Company' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Companies</SelectItem>
                {companies?.map((company: any) => {
                  return (
                    <SelectItem
                      key={company.id}
                      value={company.id}
                    >
                      {company.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {(location || company_id || searchQuery) && (
          <Button
            variant="destructive"
            onClick={clearFilters}
            className="h-12 sm:h-11 px-3 sm:px-4"
          >
            <X size={18} className="mr-2" />
            <span className="hidden sm:inline">Clear filters</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="sm:hidden flex flex-col gap-3 mb-4 p-4 rounded-lg border">
          <div className="flex flex-col gap-3">
            <Select value={location} onValueChange={handleLocationChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder='Filter by Location'>
                  {location ? getStateLabel(location) : 'Filter by Location'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Locations</SelectItem>
                  {statesList.map((state) => {
                    return (
                      <SelectItem
                        key={`${state.countryCode}-${state.isoCode}`}
                        value={state.displayValue}
                      >
                        {state.displayLabel}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={company_id} onValueChange={handleCompanyChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder='Filter by Company' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies?.map((company: any) => {
                    return (
                      <SelectItem
                        key={company.id}
                        value={company.id}
                      >
                        {company.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {(location || company_id || searchQuery) && (
            <Button
              variant="destructive"
              onClick={clearFilters}
              className="h-12 w-full"
            >
              <X size={18} className="mr-2" />
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {(loadingJobs || (user && loadingSavedJobs)) && (
        <div className="mt-4 sm:mt-6">
          <BarLoader width={"100%"} color="#36d7b7" />
        </div>
      )}

      {!loadingJobs && !(user && loadingSavedJobs) && totalItems > 0 && (
        <div className="flex sm:hidden justify-between items-center mb-4 p-3 rounded-lg">
          <div className="flex items-center gap-2 justify-between min-w-full">
            <p className="text-sm">
              Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, totalItems)}</span> of <span className="font-semibold">{totalItems}</span>
            </p>
            <p className="text-sm">
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            </p>
          </div>
        </div>
      )}

      {!loadingJobs && !(user && loadingSavedJobs) && totalItems > 0 && (
        <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 p-2 sm:p-3 rounded-lg">

          <p className="mb-2 sm:mb-0">
            Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, totalItems)}</span> of <span className="font-semibold">{totalItems}</span> jobs
          </p>

          {totalPages > 1 && !loadingJobs && (
            <div className="hidden sm:flex justify-center mb-4 sm:mb-0">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {currentPage > 3 && totalPages > 5 && (
                    <>
                      <PaginationItem>
                        <Button
                          onClick={() => handlePageChange(1)}
                          variant="outline"
                          className="cursor-pointer h-9 w-9 p-0"
                        >
                          1
                        </Button>
                      </PaginationItem>
                      {currentPage > 4 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {getPageNumbers().map((page) => (
                    <PaginationItem key={page}>
                      <Button
                        onClick={() => handlePageChange(page)}
                        variant={currentPage === page ? "blue" : "outline"}
                        className="cursor-pointer h-9 w-9 p-0"
                      >
                        {page}
                      </Button>
                    </PaginationItem>
                  ))}

                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <Button
                          onClick={() => handlePageChange(totalPages)}
                          variant="outline"
                          className="cursor-pointer h-9 w-9 p-0"
                        >
                          {totalPages}
                        </Button>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <p className="text-sm sm:ml-4 hidden sm:block">
            Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
          </p>
        </div>
      )}

      {totalPages > 1 && !loadingJobs && !(user && loadingSavedJobs) && (
        <div className="mb-6 sm:hidden">
          <Pagination>
            <PaginationContent className="flex-wrap justify-center">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  size="sm"
                />
              </PaginationItem>

              {(() => {
                let pagesToShow = [];
                if (totalPages <= 3) {
                  for (let i = 1; i <= totalPages; i++) {
                    pagesToShow.push(i);
                  }
                } else if (currentPage === 1) {
                  pagesToShow = [1, 2, 3];
                } else if (currentPage === totalPages) {
                  pagesToShow = [totalPages - 2, totalPages - 1, totalPages];
                } else {
                  pagesToShow = [currentPage - 1, currentPage, currentPage + 1];
                }

                return pagesToShow.map((page) => (
                  <PaginationItem key={page}>
                    <Button
                      onClick={() => handlePageChange(page)}
                      variant={currentPage === page ? "blue" : "outline"}
                      className="cursor-pointer h-9 w-9 p-0"
                      size="sm"
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                ));
              })()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  size="sm"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <div className='mt-2 sm:mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
        {!loadingJobs && !(user && loadingSavedJobs) && (
          currentJobs?.length !== 0 ?
            currentJobs?.map((job: any) =>
              <JobCard
                key={job.id}
                job={job}
                isMyJob={undefined}
                savedInit={false} // Como estamos filtrando trabajos no guardados, siempre será false
                onJobSaved={() => {
                  refreshSavedJobs();
                  // También podemos recargar los trabajos para que desaparezca de la lista
                  fetchJobs();
                }}
              />
            )
            :
            <div className="col-span-full py-12 text-center">
              <p className="text-lg sm:text-xl text-gray-600">{noJobsMessage}</p>
              {noJobsMessage.includes("saved") && (
                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    variant="outline"
                    asChild
                  >
                    <a href="/saved-jobs">View Saved Jobs</a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Clear filters and try again
                  </Button>
                </div>
              )}
              {!noJobsMessage.includes("saved") && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear filters and try again
                </Button>
              )}
            </div>
        )}
      </div>

      {errorJobs && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-600">Error loading jobs. Please try again.</p>
          <Button
            variant="outline"
            onClick={() => fetchJobs()}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

export default JobListing;