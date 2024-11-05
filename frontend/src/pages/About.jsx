import image from "../assets/img1.png";
export default function About() {
  return (
    <div className="py-20 px-4 max-w-6xl mx-auto  rounded-lg flex flex-col md:flex-row">
      <div className="md:w-1/2">
        <img
          src={image}
          alt="Niina Estate"
          className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
        />
      </div>
      <div className="md:w-1/2 p-6">
        <h1 className="text-4xl font-bold mb-6 text-slate-800">
          About Niina Estate
        </h1>
        <p className="mb-6 text-slate-700 text-lg leading-relaxed">
          Niina Estate is a leading real estate agency that specializes in
          helping clients buy, sell, and rent properties in the most desirable
          neighborhoods. Our team of experienced agents is dedicated to
          providing exceptional service and making the buying and selling
          process as smooth as possible.
        </p>
        <p className="mb-6 text-slate-700 text-lg leading-relaxed">
          Our mission is to help our clients achieve their real estate goals by
          providing expert advice, personalized service, and a deep
          understanding of the local market. Whether you are looking to buy,
          sell, or rent a property, we are here to help you every step of the
          way.
        </p>
        <p className="mb-6 text-slate-700 text-lg leading-relaxed">
          Our team of agents has a wealth of experience and knowledge in the
          real estate industry, and we are committed to providing the highest
          level of service to our clients. We believe that buying or selling a
          property should be an exciting and rewarding experience, and we are
          dedicated to making that a reality for each and every one of our
          clients.
        </p>
      </div>
    </div>
  );
}
