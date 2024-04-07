import { DeleteIcon } from "@/app/management/DeleteIcon";
import { IssueModalProps } from "@/interfaces/IssueModalProps";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  Tooltip,
} from "@nextui-org/react";
import { Octokit } from "octokit";
import { toast } from "react-hot-toast";

const DeleteIssueModal: React.FC<IssueModalProps> = ({
  issueNumber,
  onResponse,
}) => {
  const deleteDialog = (id: number) => {
    onOpen();
  };
  const deleteIssue = async () => {
    try {
      const deleteIssueOctokit = new Octokit({ auth: `` });
      const response = await deleteIssueOctokit.request(
        `PUT /repos/Shih-Yang-Young/issue-blog/issues/${issueNumber}/lock`,
        {
          owner: "Shih-Yang-Young",
          repo: "issue-blog",
          issue_number: issueNumber,
          lock_reason: "off-topic",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );
      toast.success("delete issue success!", {
        style: { background: "green", color: "white" },
        position: "top-center",
      });
      onResponse();
      onClose();
    } catch (error) {
      console.error("Error creating issue:", error);
      toast.error("delete issue error", {
        style: { background: "red", color: "white" },
        position: "top-center",
      });
    }
  };
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  return (
    <div>
      <Tooltip color="danger" content="Delete Issue">
        <span
          className="text-lg text-danger cursor-pointer active:opacity-50"
          onClick={() => deleteDialog(issueNumber)}
        >
          <DeleteIcon />
        </span>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">
                Are u Sure Delete Issue Number {issueNumber}?
              </ModalHeader>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={deleteIssue}>
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

export default DeleteIssueModal;
