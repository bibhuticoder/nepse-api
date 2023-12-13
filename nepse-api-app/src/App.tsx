import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";
import LineChart from "./LineChart";

type Company = {
  id: string;
  name: string;
};

type Companies = {
  [key: string]: Company;
};

type StockData = {
  date: string;
  price: number;
};

function App() {
  const [activeCompany, setActiveCompany] = useState<string>();
  const [companies, setCompanies] = useState<Companies>();
  const [stocksData, setStocksData] = useState<StockData[]>();

  // console.log(Object.keys(companies ? companies : []).length, "companiees");
  // console.log(companies ? companies : [], "companiees");

  useEffect(() => {
    axios
      .get("https://the-value-crew.github.io/nepse-api/data/companies.json")
      .then((resp) => {
        console.log(resp.data, "this is resp");
        setCompanies(resp.data);
        setActiveCompany(Object.keys(resp.data).shift());
      })
      .catch((e) => console.log(e, "this is sameer"));
  }, []);

  // console.log(activeCompany, "this is active company");

  useEffect(() => {
    // ... (your existing code for fetching companies)

    const fetchData = async () => {
      try {
        if (activeCompany) {
          // Dynamically import the JSON file
          const { default: jsonData } = await import(
            `../../data/company/${activeCompany}.json`
          );

          console.log(jsonData, "this is json dta");

          // Process the data
          let data = Object.entries(jsonData)
            .map(([date, value]) => ({
              date,
              price: (value as any).price.close,
            }))
            .slice(-20);

          setStocksData(data);
        }
      } catch (error) {
        console.error(`Error loading JSON data: ${error}`);
      }
    };

    fetchData();
  }, [activeCompany]);

  // useEffect(() => {
  //   axios
  //     .get(
  //       `https://the-value-crew.github.io/nepse-api/data/company/${activeCompany}.json`
  //     )
  //     .then((resp) => {
  //       let data = Object.entries(resp.data)
  //         .map(([date, value]) => {
  //           return { date, price: (value as any).price.close };
  //         })
  //         .slice(-50);
  //       setStocksData(data);
  //     })
  //     .catch((e) => console.log(e));
  // }, [activeCompany]);

  return (
    <div className="App">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center my-16">
          <h1 className="text-5xl mb-8 font-semibold text-gray-800 font-Montserrat">
            Nepse API
          </h1>
          <p className="text-3xl text-gray-700 font-Lato">
            Demo application developed to illustrate &nbsp;
            <a
              href="https://github.com/the-value-crew/nepse-api"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500 italic"
            >
              nepse-api{" "}
            </a>
          </p>
        </div>

        {/* Data */}
        <div className="flex w-100">
          {/* Companies */}
          <Card className="w-96">
            <div>
              <p className="text-2xl text-gray-800 mb-8">🏢 Listed companies</p>
              <form className="flex" role="search">
                <input
                  className="form-input w-full border-2 border-gray-300 focus:border-blue-500"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>

              <ul className="h-96 overflow-auto">
                {companies &&
                  Object.entries(companies).map(([compCode, company]) => {
                    return (
                      <li
                        key={compCode}
                        className="my-2 p-2 mr-2 rounded cursor-pointer hover:bg-gray-100"
                        onClick={() => setActiveCompany(compCode)}
                      >
                        {company.name}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </Card>

          {/* Latest stocks price */}
          <Card className="flex-grow">
            {activeCompany && companies && (
              <>
                <div>
                  <p className="text-2xl text-gray-800">
                    {companies[activeCompany].name}
                  </p>
                </div>

                {stocksData && <LineChart data={stocksData} />}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
