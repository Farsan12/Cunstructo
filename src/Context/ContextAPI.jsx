import OtherPurpuseContextApi from "./OtherPurpuseContextApi";
import SocketioContext from "./SocketioContext";


function ContextAPI({ children }) {

  

  return (
    <>
      <SocketioContext>
        <OtherPurpuseContextApi>
          {children}
          
        </OtherPurpuseContextApi>
      </SocketioContext>
    </>
  );
}

export default ContextAPI