// CountriesTable.tsx
import React, { useState } from "react";
import Read from "../server/ReadCountries";
import Chart from "./Chart";
import NewCountryForm from "./NewCountryForm";
import DeleteButton from "./DeleteButton";
import "./style/CountriesTable.css";

interface CountryData {
  id: number;
  country_name: string;
  value: number;
}

const CountriesTable: React.FC = () => {
  const [countriesData, setCountriesData] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null
  );
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const handleDataLoaded = (data: CountryData[]) => {
    setCountriesData(data);
  };

  const handleRowDoubleClick = (country: CountryData) => {
    setSelectedCountry(country);
  };

  const handleRowClick = (index: number) => {
    setSelectedRowIndex(index);
  };

  const handleCloseChart = () => {
    setSelectedCountry(null);
  };

  const [countries, setCountries] = useState<any[]>([]);

  const handleNewCountry = (newCountry: any) => {
    setCountries([...countries, newCountry]);
  };

  const handleDeleteCountry = () => {
    if (selectedRowIndex !== null) {
      const updatedCountriesData = [...countriesData];
      updatedCountriesData.splice(selectedRowIndex, 1);
      setCountriesData(updatedCountriesData);

      setSelectedCountry(null);
      setSelectedRowIndex(null);
    }
  };

  return (
    <div className="PageContainer">
      <div className="TableContainer">
        <Read onDataLoaded={handleDataLoaded} />
        <div className="tableWrapper">
          <table>
            <thead style={{position:"sticky", top: 0}}>
              <tr>
                <th>No.</th>
                <th>Country</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {countriesData.map((country, index) => (
                <tr
                  key={country.id}
                  onDoubleClick={() => handleRowDoubleClick(country)}
                  onClick={() => handleRowClick(index)}
                  style={{
                    backgroundColor:
                      selectedRowIndex === index ? "gray" : "#dcdcdc",
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{country.country_name}</td>
                  <td>{country.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCountry && (
          <Chart countryData={selectedCountry} onClose={handleCloseChart} />
        )}
        <div className="CountryFormContainer">
          <NewCountryForm onNewCountry={handleNewCountry} />
          <DeleteButton
            countryId={
              selectedRowIndex !== null
                ? countriesData[selectedRowIndex]?.id
                : undefined
            }
            onDelete={handleDeleteCountry}
          />
        </div>
      </div>
    </div>
  );
};

export default CountriesTable;