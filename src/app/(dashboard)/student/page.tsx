import EventCalendar from "@/app/components/Calendar";

const StudentPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/*LEFT*/}
      <div className="w-full cl:w-2/3"></div>
      {/*RIGHTT*/}
      <div className="w-full xl:w-1/3  flex flex-col gap-8">
        <EventCalendar />
      </div>
    </div>
  );
};

export default StudentPage;
