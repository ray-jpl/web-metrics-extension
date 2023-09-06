import { useSearchParams } from "react-router-dom";

const SiteDashboard = () => {
  const [searchParams] = useSearchParams();
  return (
    <div className="h-full">
      <div className="flex justify-start mt-5 relative top-0 w-full md:px-10">
        <h1 className="text-xl font-semibold">{searchParams.get("url")}</h1>
      </div>
    </div>
  )
}

export default SiteDashboard