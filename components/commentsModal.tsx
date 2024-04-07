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

const CommentsModal: React.FC<IssueModalProps> = ({issueNumber, onResponse}) => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();  
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
            <Tooltip content="Comments">
              <span 
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={onOpen}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Issue Number {issueNumber} Comments
                    </ModalHeader>
                    <ModalBody>
                      aaa
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
        </div>
        
    );
}

export default CommentsModal;