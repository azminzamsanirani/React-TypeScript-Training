import React, { useState, useEffect } from "react";
import {
  Department,
  ReadDepartments,
  Plant,
  ReadPlants,
  ReadSites,
  Site,
  WorkCenter,
  ReadWorkCenters,
  WorkStation,
  ReadWorkStations,
  ReadAssets,
  Asset,
  Transaction,
  ReadTransactions,
} from "../Database/FetchData";
import "../Style/DropDownFilter.css";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface SeriesData {
  color?: string;
  name: string;
  data: {
    x: string;
    y: [number, number];
  }[];
}

const DropdownFilter: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [workStations, setWorkStations] = useState<WorkStation[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchButton, setSearchButton] = useState<boolean | null>(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isoDate, setISODate] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [selectedWorkCenter, setSelectedWorkCenter] =
    useState<WorkCenter | null>(null);
  const [selectedWorkStation, setSelectedWorkStation] =
    useState<WorkStation | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [chartMax, setChartMax] = useState<number>();
  const [chartMin, setChartMin] = useState<number>();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const handleSitesLoad = (data: Site[]) => {
    setSites(data);
  };

  const handlePlantsLoad = (data: Plant[]) => {
    setPlants(data);
  };

  const handleDepartmentsLoad = (data: Department[]) => {
    setDepartments(data);
  };

  const handleWorkCentersLoad = (data: WorkCenter[]) => {
    setWorkCenters(data);
  };

  const handleWorkStationsLoad = (data: WorkStation[]) => {
    setWorkStations(data);
  };

  const handleAssetsLoaded = (data: Asset[]) => {
    setAssets(data);
    console.log("assets: ", assets);
  };

  const handleDateChange = (data: Date) => {
    // console.log("selectedDate: ", selectedDate);
  };

  const handleSiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSiteId = parseInt(event.target.value);
    const selectedSite = sites.find((site) => site.site_id === selectedSiteId);
    setSelectedSite(selectedSite || null);
  };

  const handlePlantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlantId = parseInt(event.target.value);
    const selectedPlant = plants.find(
      (plant) => plant.plant_id === selectedPlantId
    );
    setSelectedPlant(selectedPlant || null);
  };

  const handleDepartmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDepartmentId = parseInt(event.target.value);
    const selectedDepartment = departments.find(
      (department) => department.department_id === selectedDepartmentId
    );
    setSelectedDepartment(selectedDepartment || null);
  };

  const handleWorkCenterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedWorkCenterId = parseInt(event.target.value);
    const selectedWorkCenter = workCenters.find(
      (workCenter) => workCenter.work_center_id === selectedWorkCenterId
    );
    setSelectedWorkCenter(selectedWorkCenter || null);
  };

  const handleWorkStationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedWorkStationId = parseInt(event.target.value);
    const selectedWorkStation = workStations.find(
      (workStation) => workStation.work_station_id === selectedWorkStationId
    );
    setSelectedWorkStation(selectedWorkStation || null);
  };

  useEffect(() => {
    // Set the initial selected site
    if (sites.length > 0) {
      setSelectedSite(sites[0]);
    }
  }, [sites]);

  useEffect(() => {
    // Set the initial selected plant based on the selected site
    if (selectedSite && plants.length > 0) {
      const initialPlant = plants.find(
        (plant) => plant.site_id === selectedSite.site_id
      );
      setSelectedPlant(initialPlant || null);
    }
  }, [selectedSite, plants]);

  useEffect(() => {
    // Set the initial selected department based on the selected plant
    if (selectedPlant && departments.length > 0) {
      const initialDepartment = departments.find(
        (department) => department.plant_id === selectedPlant.plant_id
      );
      setSelectedDepartment(initialDepartment || null);
    }
  }, [selectedPlant, departments]);

  useEffect(() => {
    // Set the initial selected work center based on the selected department
    if (selectedDepartment && workCenters.length > 0) {
      const initialWorkCenter = workCenters.find(
        (workCenter) =>
          workCenter.department_id === selectedDepartment.department_id
      );
      setSelectedWorkCenter(initialWorkCenter || null);
    }
  }, [selectedDepartment, workCenters]);

  useEffect(() => {
    // Set the initial selected work station based on the selected work center
    if (selectedWorkCenter && workStations.length > 0) {
      const initialWorkStation = workStations.find(
        (workStation) =>
          workStation.work_center_id === selectedWorkCenter.work_center_id
      );
      setSelectedWorkStation(initialWorkStation || null);
    }
  }, [selectedWorkCenter, workStations]);

  //   useEffect(() => {
  //     console.log("selectedSite: ", selectedSite);
  //     console.log("selectedPlant: ", selectedPlant);
  //     console.log("selectedDepartment: ", selectedDepartment);
  //     console.log("selectedWorkCenter: ", selectedWorkCenter);
  //     console.log("selectedWorkStation: ", selectedWorkStation);
  //     console.log("selectedWorkStation: ", selectedWorkStation);
  //   }, [
  //     selectedSite,
  //     selectedPlant,
  //     selectedDepartment,
  //     selectedWorkCenter,
  //     selectedWorkStation,
  //   ]);

  useEffect(() => {
    const newISODate = selectedDate.toISOString();
    const adjustedDate = new Date(newISODate);
    adjustedDate.setHours(adjustedDate.getHours() + 8);

    // Set chartMin to 12:00 AM (midnight) of the selected date
    const chartMinDate = adjustedDate;
    chartMinDate.setHours(0, 0, 0, 0);
    chartMinDate.setHours(chartMinDate.getHours() + 8);
    setChartMin(chartMinDate.getTime());

    // Set chartMax to 11:59 PM of the selected date
    const chartMaxDate = adjustedDate;
    chartMaxDate.setHours(23, 59, 59, 999);
    chartMaxDate.setHours(chartMaxDate.getHours() + 8);
    setChartMax(chartMaxDate.getTime());

    setISODate(adjustedDate.toISOString());
  }, [selectedDate]);

  // const itemsPerPage = 4;

  useEffect(() => {
    setTotalPages(CalculateTotalPages(assets, itemsPerPage));
    // console.log("totalpage: ", totalPages);
  }, [assets, itemsPerPage]);

  const CalculateTotalPages = (assets: Asset[], itemsPerPage: number) => {
    return Math.ceil(assets.length / itemsPerPage);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedAssets = assets.slice(startIndex, endIndex);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const firstPage = () => {
    setCurrentPage(0);
  };

  const lastPage = () => {
    setCurrentPage(totalPages - 1);
  };

  const handleSearch = () => {
    // console.log("Selected Site: ", selectedSite);
    // console.log("Selected Plant: ", selectedPlant);
    // console.log("Selected Department: ", selectedDepartment);
    // console.log("Selected Work Center: ", selectedWorkCenter);
    // console.log("Selected Work Station: ", selectedWorkStation);
    // console.log("Assets: ", assets);
    // console.log("totalpageinsearch: ", totalPages);
    setSearchButton(true);
  };

  const handleTransactionsLoaded = (data: Transaction[]) => {
    setTransactions(data);
  };

  // Function to get transactions for a specific asset
  const getTransactionsForAsset = (assetId: number) => {
    const assetTransactions = transactions.filter(
      (transaction) => transaction.asset_id === assetId
    );

    // Log asset ID and its transactions
    // console.log("Transactions:", assetTransactions);
    // console.log(`Asset ID: ${assetId}`);

    return assetTransactions;
  };

  const CalculateUtilization = (transactions: Transaction[]) => {
    // Calculate total running time
    let totalRunningTime = 0;

    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      let startTime = new Date();
      let endTime = new Date();
      let endTimeString;

      if (transaction.value === 1) {
        if (transactions[i + 1]) {
          startTime = new Date(transaction.timestamp);
          endTime = new Date(transactions[i + 1].timestamp);
        } else {
          startTime = new Date(transaction.timestamp);
          startTime.setHours(startTime.getHours() - 8);
          endTimeString =
            new Date(transaction.timestamp).toISOString().split("T")[0] +
            "T23:59:59";
          endTime = new Date(endTimeString);
        }

        const runningTimeInMilliseconds =
          endTime.getTime() - startTime.getTime();

        // console.log("startTime : ", startTime);
        // console.log("endTimeString : ", endTimeString);
        // console.log("endTime : ", endTime);
        // console.log("runningTimeInMilliseconds : ", runningTimeInMilliseconds);
        totalRunningTime += runningTimeInMilliseconds;
      }
    }

    // Calculate total time in 24 hours
    const total24Hours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // console.log("totalRunningTime: ", totalRunningTime);

    // Calculate utilization percentage
    const utilization = (totalRunningTime / total24Hours) * 100;

    return <div>{utilization.toFixed(2)}%</div>;
  };

  const CompileChartData = (transactions: Transaction[]) => {
    const statusMap: Record<number, string> = {
      1: "running",
      2: "idle",
      3: "down",
      4: "offline",
    };

    const results: SeriesData[] = [];

    transactions.forEach((transaction, index) => {
      const currentStatus = statusMap[transaction.value];
      const nextTransaction = transactions[index + 1];

      if (nextTransaction) {
        const startDate =
          new Date(transaction.timestamp).getTime() - 3600 * 1000;
        const endDate =
          new Date(nextTransaction.timestamp).getTime() - 3600 * 1000;

        const data = {
          x: transaction.asset_id.toString(),
          y: [startDate, endDate] as [number, number],
        };

        results.push({
          name: currentStatus,
          data: [data],
        });
      } else {
        const startDate =
          new Date(transaction.timestamp).getTime() - 3600 * 1000;
        let endDateTemp = new Date(transaction.timestamp);
        endDateTemp.setUTCHours(24, 0, 0);
        let endDate = endDateTemp.getTime() - 3600 * 1000;

        const data = {
          x: transaction.asset_id.toString(),
          y: [startDate, endDate] as [number, number],
        };

        results.push({
          name: currentStatus,
          data: [data],
        });
      }
    });

    const uniqueColors: Record<string, string> = {
      running: "#0daa9b",
      idle: "#ffaa00",
      down: "#BC0000",
      offline: "#000000",
    };

    const mergedData: Record<string, SeriesData> = {};

    results.forEach((series) => {
      const seriesName = series.name;

      if (!mergedData[seriesName]) {
        // If the series doesn't exist in mergedData, add it
        mergedData[seriesName] = series;
      } else {
        // If the series already exists, concatenate the data
        mergedData[seriesName].data = mergedData[seriesName].data.concat(
          series.data
        );
      }

      // Assign color to the series
      mergedData[seriesName].color = uniqueColors[seriesName];
    });

    return Object.values(mergedData);
  };

  const chartOptions: ApexOptions = {
    chart: {
      height: 350,
      type: "rangeBar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        rangeBarGroupRows: true,
      },
    },
    fill: {
      type: "solid",
    },
    xaxis: {
      type: "datetime",
      min: chartMin,
      max: chartMax,
    },
    yaxis: {
      show: false,
    },
    legend: {
      show: false,
    },
  };

  return (
    <div>
      <div className="DropdownContainer">
        <FilterAltIcon style={{ fontSize: "40px" }} />

        {/* Site dropdown */}
        <div>
          <ReadSites onDataLoaded={handleSitesLoad} />
          <label htmlFor="siteDropdown">Site:</label>
          <select
            id="siteDropdown"
            value={selectedSite?.site_id}
            onChange={handleSiteChange}
          >
            {sites.map((site) => (
              <option key={site.site_id} value={site.site_id}>
                {site.site_name}
              </option>
            ))}
          </select>
        </div>

        {/* Plant dropdown */}
        <div>
          <ReadPlants onDataLoaded={handlePlantsLoad} />
          <label htmlFor="plantDropdown">Plant:</label>
          <select
            id="plantDropdown"
            value={selectedPlant?.plant_id}
            onChange={handlePlantChange}
          >
            {plants
              .filter((plant) => plant.site_id === selectedSite?.site_id)
              .map((plant) => (
                <option key={plant.plant_id} value={plant.plant_id}>
                  {plant.plant_name}
                </option>
              ))}
          </select>
        </div>

        {/* Department dropdown */}
        <div>
          <ReadDepartments onDataLoaded={handleDepartmentsLoad} />
          <label htmlFor="departmentDropdown">Department:</label>
          <select
            id="departmentDropdown"
            value={selectedDepartment?.department_id || ""}
            onChange={handleDepartmentChange}
          >
            {departments
              .filter(
                (department) => department.plant_id === selectedPlant?.plant_id
              )
              .map((department) => (
                <option
                  key={department.department_id}
                  value={department.department_id}
                >
                  {department.department_name}
                </option>
              ))}
          </select>
        </div>

        {/* Work Center dropdown */}
        <div>
          <ReadWorkCenters onDataLoaded={handleWorkCentersLoad} />
          <label htmlFor="workCenterDropdown">Work Center:</label>
          <select
            id="workCenterDropdown"
            value={selectedWorkCenter?.work_center_id || ""}
            onChange={handleWorkCenterChange}
          >
            {workCenters
              .filter(
                (workCenter) =>
                  workCenter.department_id === selectedDepartment?.department_id
              )
              .map((workCenter) => (
                <option
                  key={workCenter.work_center_id}
                  value={workCenter.work_center_id}
                >
                  {workCenter.work_center_name}
                </option>
              ))}
          </select>
        </div>

        {/* Work Station dropdown */}
        <div>
          <ReadWorkStations onDataLoaded={handleWorkStationsLoad} />
          <label htmlFor="workStationDropdown">Work Station:</label>
          <select
            id="workStationDropdown"
            value={selectedWorkStation?.work_station_id || ""}
            onChange={handleWorkStationChange}
          >
            {workStations
              .filter(
                (workStation) =>
                  workStation.work_center_id ===
                  selectedWorkCenter?.work_center_id
              )
              .map((workStation) => (
                <option
                  key={workStation.work_station_id}
                  value={workStation.work_station_id}
                >
                  {workStation.work_station_name}
                </option>
              ))}
          </select>
        </div>

        <button onClick={handleSearch}>SEARCH</button>

        {searchButton && (
          <>
            <ReadAssets
              workStationId={selectedWorkStation?.work_station_id ?? 0}
              onDataLoaded={handleAssetsLoaded}
            />
            <ReadTransactions
              timestamp={isoDate}
              onDataLoaded={handleTransactionsLoaded}
            />
          </>
        )}

        {/* Date Picker */}
        <div>
          <DatePicker
            selected={selectedDate}
            onChange={(selected) => {
              if (selected !== null) {
                handleDateChange(selected);
                setSelectedDate(selected);
              }
            }}
            maxDate={new Date()}
          />
        </div>
      </div>

      {assets && (
        <div>
          {displayedAssets.map((asset, index) => {
            // Get transactions for the current asset
            const assetTransactions = getTransactionsForAsset(asset.asset_id);

            // Call CompileChartData to get chart data and colors
            const chartData = CompileChartData(assetTransactions);

            return (
              <div key={index} className="Asset">
                <div className="AssetInfo">
                  <div className="AssetName">{asset.asset_name}</div>
                  <div className="AssetImageContainer">
                    <div className="AssetImageIcon">
                      <PrecisionManufacturingIcon
                        style={{ fontSize: "40px" }}
                      />
                    </div>
                    <div className="AssetImage">
                      <img
                        src={require("../assets/image/" +
                          asset.asset_image_path.split("/").slice(-1))}
                        style={{ width: "150px", height: "130px" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="AssetData">
                  <div className="AssetUtilization">
                    <div>Utilization</div>
                    {CalculateUtilization(assetTransactions)}
                  </div>
                  <div className="AssetChart">
                    <ReactApexChart
                      options={chartOptions}
                      series={chartData}
                      type="rangeBar"
                      height={150}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {searchButton && (
            <>
              <div className="LegendContainer">
                <li style={{ color: "#000000" }}>Offline</li>
                <li style={{ color: "#BC0000" }}>Down</li>
                <li style={{ color: "#ffaa00" }}>Idle</li>
                <li style={{ color: "#0daa9b" }}>Running</li>
              </div>

              <div className="PaginationContainer">
                <button
                  className="PageButton"
                  onClick={firstPage}
                  disabled={currentPage === 0}
                >
                  <SkipPreviousIcon style={{ color: "#00718f" }} />
                </button>
                <button
                  className="PageButton"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                >
                  <PlayArrowIcon
                    style={{ transform: "rotate(180deg)", color: "#00718f" }}
                  />
                </button>
                <div className="PaginationText">
                  {currentPage + 1} / {totalPages}
                </div>
                <button
                  className="PageButton"
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  <PlayArrowIcon style={{ color: "#00718f" }} />
                </button>
                <button
                  className="PageButton"
                  onClick={lastPage}
                  disabled={currentPage === totalPages - 1}
                >
                  <SkipNextIcon style={{ color: "#00718f" }} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownFilter;
