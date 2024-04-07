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
  console.log("aaaa");
  const [issueTitle, setIssueTitle] = useState("");
  const [issueBody, setIssueBody] = useState("");
  const editIssue = async () => {
    try {
      const editIssueOctokit = new Octokit({ auth: `` });
      const response = editIssueOctokit.request(`PATCH /repos/Shih-Yang-Young/issue-blog/issues/${issueNumber}`, {
        owner: 'Shih-Yang-Young',
        repo: 'issue-blog',
        issue_number: issueNumber,
        title: issueTitle,
        body: issueBody,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      toast.success("add issue success!", {
        style: { background: "green", color: "white" },
        position: "top-center",
      });
      onClose();
      setTimeout(() => {
        onResponse();
      }, 2000);
    } catch (error) {
      console.error("Error creating issue:", error);
      toast.error("add issue error", {
        style: { background: "red", color: "white" },
        position: "top-center",
      });
    }
  };
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();  
  return (
        <div>
            <Tooltip content="Edit Issue">
              <span 
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={onOpen}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Edit Issue Number {issueNumber} 
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        autoFocus
                        label="title"
                        placeholder="Enter your title"
                        variant="bordered"
                        required
                        value={issueTitle}
                        onChange={(e) => setIssueTitle(e.target.value)}
                      />
                      <Textarea
                        label="body"
                        placeholder="Enter your body"
                        variant="bordered"
                        size="lg"
                        value={issueBody}
                        onChange={(e) => setIssueBody(e.target.value)}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={editIssue}>
                        Add New Issue
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
        </div>
    );
}
export default EditIssueModal;