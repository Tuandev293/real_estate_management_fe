import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { HomePageLocal } from "../../locales/locales";

function Modal({ isModalOpen, handleOk, handleCancel }) {
  return (
    <>
      <Dialog open={isModalOpen} handler={() => {}}>
        <DialogBody className="font-bold text-xl">
          {HomePageLocal.delete}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleCancel}
            className="mr-1"
          >
            <span className="text-lg">{HomePageLocal.cancel}</span>
          </Button>
          <Button variant="gradient" color="red" onClick={handleOk}>
            <span className="text-sm">{HomePageLocal.confirm}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Modal;
