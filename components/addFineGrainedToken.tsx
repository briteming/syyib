import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";

const AddTokenModal = () => {
  const [fineGrainedAccessToken, setFineGrainedAccessToken] = useState("");
  const addToken = async () => {
    sessionStorage.setItem("fineGrainedAccessToken", fineGrainedAccessToken);
    toast.success("add fine grained access token success!", {
      style: { background: "green", color: "white" },
      position: "top-center",
    });
    onClose();
  };
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Add Fine Grained Token
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Fine Grained Token
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="fine grained access token"
                  placeholder="Enter your fine grained access token"
                  variant="bordered"
                  required
                  value={fineGrainedAccessToken}
                  onChange={(e) => setFineGrainedAccessToken(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={addToken}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddTokenModal;
