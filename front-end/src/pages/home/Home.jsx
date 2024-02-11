import "./Home.css";
import Test from "../../assets/Test.jpg";

function Home() {
  return (
    <>
      <div className="flex justify-between items-center font-medium">
        <div className="px-[20rem] py-[10rem]">
          <div className="font-bold text-4xl">
            A Digital Data Collection Service
          </div>
          <div className="py-10">
            Providing Schools with Seamless Data Storage and Search <br /> We
            build ready made databases and applications
          </div>
          <a
            href="/signin"
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Access your Dashboard
          </a>
        </div>

        <img className="h-[30rem] w-[50rem] rounded-bl-[12rem]" src={Test} />
      </div>
      <div className="flex justify-center mt-12 font-medium">
        <div className="mr-12">
          <h1 className="font-bold text-6xl">Our Client</h1>
          <div className="mt-6">
            <div>Several Selected Clients, who already</div>
            <div>believe in our service.</div>
          </div>
        </div>
        <div className="flex space-x-20"></div>
      </div>
    </>
  );
}

export default Home;
