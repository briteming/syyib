import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { Octokit } from "octokit";
import { toast } from "react-hot-toast";
import { IssueModalProps } from "@/interfaces/IssueModalProps";
import { EditIcon } from "@/app/management/EditIcon";


const EditIssueModal: React.FC<IssueModalProps> = ({issueNumber, onResponse}) => {
    return (
        <div>
            <Tooltip content="Edit Issue">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
        </div>
    );
}
export default EditIssueModal;