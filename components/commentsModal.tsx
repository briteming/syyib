import { EyeIcon } from "@/app/management/EyeIcon";
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

const commentsModal: React.FC<IssueModalProps> = ({issueNumber, onResponse}) => {
    const getComments = async () => {
        const octokit = new Octokit();
        const response = await octokit.request(`GET /repos/Shih-Yang-Young/issue-blog/issues/${issueNumber}/comments`, {
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
        console.log(response)
    }
    return(
        <div>
            <Tooltip content="Details">
              <span 
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={getComments}
              >
                <EyeIcon />
              </span>
            </Tooltip>
        </div>
    );
}

export default commentsModal;