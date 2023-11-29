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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ReactPaginate from "react-paginate";

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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
    // console.log("assets: ", assets);
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

    setISODate(adjustedDate.toISOString());
  }, [selectedDate]);

  const itemsPerPage = 4;

  useEffect(() => {
    setTotalPages(CalculateTotalPages(assets, itemsPerPage));
    // console.log("totalpage: ", totalPages);
  }, [assets, itemsPerPage]);

  const CalculateTotalPages = (assets: Asset[], itemsPerPage: number) => {
    return Math.ceil(assets.length / itemsPerPage);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const subset = assets.slice(startIndex, endIndex);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
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
    // console.log("transaction: ", data);
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
    // console.log("Transactions:", assetTransactions);

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

  //   const CompileChartData = (transactions: Transaction[]) => {
  //     const getValueStatus = (value: number): string => {
  //       switch (value) {
  //         case 1:
  //           return "running";
  //         case 2:
  //           return "idle";
  //         case 3:
  //           return "down";
  //         case 4:
  //           return "offline";
  //         default:
  //           return "";
  //       }
  //     };

  //     const chartData = transactions.map((transaction) => {
  //       return {
  //         name: getValueStatus(transaction.value),
  //         data: [
  //           {
  //             x: transaction.asset_id.toString(),
  //             y: new Date(transaction.timestamp).getTime(),
  //           },
  //         ],
  //       };
  //     });

  //     console.log("chartData", chartData);

  //     return chartData;
  //   };

  //   const chartSeries = [
  //     {
  //       name: "George Washington",
  //       data: [
  //         {
  //           x: "President",
  //           y: [new Date(1789, 3, 30).getTime(), new Date(1797, 2, 4).getTime()],
  //         },
  //       ],
  //     },
  //     // John Adams
  //     {
  //       name: "John Adams",
  //       data: [
  //         {
  //           x: "President",
  //           y: [new Date(1797, 2, 4).getTime(), new Date(1801, 2, 4).getTime()],
  //         },
  //       ],
  //     },
  //     // Thomas Jefferson
  //     {
  //       name: "Thomas Jefferson",
  //       data: [
  //         {
  //           x: "President",
  //           y: [new Date(1801, 2, 4).getTime(), new Date(1809, 2, 4).getTime()],
  //         },
  //       ],
  //     },
  //   ];
  //   const rawData: SeriesData[] = [
  //     {
  //       name: "running",
  //       data: [
  //         {
  //           x: "5",
  //           y: [
  //             new Date("2022-02-20T00:00:00.000Z").getTime(),
  //             new Date("2022-02-20T01:36:00.000Z").getTime(),
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       name: "offline",
  //       data: [
  //         {
  //           x: "5",
  //           y: [
  //             new Date("2022-02-20T01:36:00.000Z").getTime(),
  //             new Date("2022-02-20T12:24:00.000Z").getTime(),
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       name: "running",
  //       data: [
  //         {
  //           x: "5",
  //           y: [
  //             new Date("2022-02-20T12:24:00.000Z").getTime(),
  //             new Date("2022-02-20T14:59:59.999Z").getTime(),
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       name: "idle",
  //       data: [
  //         {
  //           x: "5",
  //           y: [
  //             new Date("2022-02-20T14:59:59.999Z").getTime(),
  //             new Date("2022-02-20T17:59:59.999Z").getTime(),
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       name: "down",
  //       data: [
  //         {
  //           x: "5",
  //           y: [
  //             new Date("2022-02-20T17:59:59.999Z").getTime(),
  //             new Date("2022-02-20T19:59:59.999Z").getTime(),
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       name: "offline",
  //       data: [
  //         {
  //           x: "5",
  //           y: [
  //             new Date("2022-02-20T20:59:59.999Z").getTime(),
  //             new Date("2022-02-20T23:59:59.999Z").getTime(),
  //           ],
  //         },
  //       ],
  //     },
  //   ];

  //   const compileChartData = (rawData: SeriesData[]) => {
  //     const uniqueColors: Record<string, string> = {
  //       running: "#008FFB",
  //       idle: "#00E396",
  //       down: "#FEB019",
  //       offline: "#FF4560",
  //     };

  //     const mergedData: Record<string, SeriesData> = {};

  //     rawData.forEach((series) => {
  //       const seriesName = series.name;

  //       if (!mergedData[seriesName]) {
  //         // If the series doesn't exist in mergedData, add it
  //         mergedData[seriesName] = series;
  //       } else {
  //         // If the series already exists, concatenate the data
  //         mergedData[seriesName].data = mergedData[seriesName].data.concat(
  //           series.data
  //         );
  //       }

  //       // Assign color to the series
  //       mergedData[seriesName].color = uniqueColors[seriesName];
  //     });

  //     return Object.values(mergedData);
  //   };

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
        const startDate = new Date(transaction.timestamp).getTime();
        const endDate = new Date(nextTransaction.timestamp).getTime() - 1;

        const data = {
          x: transaction.asset_id.toString(),
          y: [startDate, endDate] as [number, number],
        };

        results.push({
          name: currentStatus,
          data: [data],
        });
      } else {
        const startDate = new Date(transaction.timestamp).getTime();
        let endDateTemp = new Date(transaction.timestamp);
        endDateTemp.setUTCHours(23, 59, 59);
        let endDate = endDateTemp.getTime();

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
      running: "#1C7D00",
      idle: "#EAD315",
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

        <div>
          {/* Date Picker */}
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
          {subset.map((asset, index) => {
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
                      {asset.asset_image_path}
                      {/* <img src={logo} style={{width: "120px", height: "100px"}}/> */}
                      {/* <img src={require( '..' + asset.asset_image_path)} /> */}
                      {/* <img src={require(`..${asset.asset_image_path}`).default} /> */}
                      {/* <img src={require(`../assets/image/asset1.png`)} style={{width: "120px", height: "100px"}}/> */}
                    </div>
                  </div>
                </div>
                <div className="AssetData">
                  <div className="AssetUtilization">
                    <div>Utilization</div>
                    {CalculateUtilization(assetTransactions)}
                    {/* <div>
                      {assetTransactions.map((transaction) => (
                        <div key={transaction.transaction_id}>
                        </div>
                      ))}
                    </div> */}
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
              <div className="PaginationContainer">
                <ReactPaginate
                  pageCount={totalPages}
                  onPageChange={handlePageChange}
                  previousLabel={
                    <PlayArrowIcon style={{ transform: "rotate(180deg)" }} />
                  }
                  nextLabel={<PlayArrowIcon />}
                  className="PaginationComponent"
                />
              </div>
              <div className="LegendContainer">
                <li style={{color: "#000000"}}>
                    Offline
                </li>
                <li style={{color: "#BC0000"}}>
                    Down
                </li>
                <li style={{color: "#EAD315"}}>
                    Idle
                </li>
                <li style={{color: "#1C7D00"}}>
                    Running
                </li>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownFilter;
