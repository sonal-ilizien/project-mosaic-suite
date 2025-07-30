import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Paperclip, 
  Send, 
  User, 
  Calendar,
  FileText,
  CheckCircle,
  X,
  Plus,
  Loader2,
  Sparkles,
  BarChart3,
  AlertCircle,
  Users,
  Tag,
  Star,
  Download,
  Trash2,
  Image,
  File
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { agileAPI, CreateCommentPayload } from "./AgileAPI";

interface Comment {
  id: number;
  text: string;
  author: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  created_at: string;
  updated_at: string;
}

interface Attachment {
  id: number;
  filename: string;
  file_size: number;
  file_type: string;
  download_url: string;
  uploaded_by: {
    id: number;
    name: string;
  };
  uploaded_at: string;
}

interface TaskCommentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number;
  taskTitle: string;
  projectName: string;
  onCommentCreated?: (comment: Comment) => void;
  onAttachmentUploaded?: (attachment: Attachment) => void;
}

interface CommentData {
  text: string;
}

const TaskCommentsModal = ({ 
  open, 
  onOpenChange, 
  taskId, 
  taskTitle, 
  projectName, 
  onCommentCreated,
  onAttachmentUploaded
}: TaskCommentsModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [commentData, setCommentData] = useState<CommentData>({ text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load comments and attachments when modal opens
  useEffect(() => {
    if (open && taskId) {
      loadComments();
      loadAttachments();
    }
  }, [open, taskId]);

  const loadComments = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockComments: Comment[] = [
        {
          id: 1,
          text: "Form validation is complete, ready for testing",
          author: {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            avatar: "JD"
          },
          created_at: "2024-01-16T11:30:00Z",
          updated_at: "2024-01-16T11:30:00Z"
        },
        {
          id: 2,
          text: "Great work! I've reviewed the implementation and it looks good.",
          author: {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            avatar: "JS"
          },
          created_at: "2024-01-16T12:00:00Z",
          updated_at: "2024-01-16T12:00:00Z"
        }
      ];
      setComments(mockComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const loadAttachments = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockAttachments: Attachment[] = [
        {
          id: 1,
          filename: "screenshot.png",
          file_size: 1024000,
          file_type: "image/png",
          download_url: "/api/attachments/1/download",
          uploaded_by: {
            id: 1,
            name: "John Doe"
          },
          uploaded_at: "2024-01-16T11:30:00Z"
        },
        {
          id: 2,
          filename: "document.pdf",
          file_size: 2048000,
          file_type: "application/pdf",
          download_url: "/api/attachments/2/download",
          uploaded_by: {
            id: 2,
            name: "Jane Smith"
          },
          uploaded_at: "2024-01-16T12:00:00Z"
        }
      ];
      setAttachments(mockAttachments);
    } catch (error) {
      console.error('Error loading attachments:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentData.text.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const commentPayload: CreateCommentPayload = {
        text: commentData.text
      };

      console.log('Creating comment:', commentPayload);
      const response = await agileAPI.addTaskComment(taskId, commentPayload);
      console.log('Comment created successfully:', response);

      toast({
        title: "Success",
        description: response.message || "Comment added successfully!",
      });

      // Reset form
      setCommentData({ text: '' });

      // Reload comments
      await loadComments();

      // Call callback if provided
      if (onCommentCreated) {
        onCommentCreated(response.data || response);
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log('Uploading file:', file.name);
        
        const response = await agileAPI.uploadTaskAttachment(taskId, file);
        console.log('File uploaded successfully:', response);

        toast({
          title: "Success",
          description: `${file.name} uploaded successfully!`,
        });

        // Call callback if provided
        if (onAttachmentUploaded) {
          onAttachmentUploaded(response.data || response);
        }
      }

      // Reload attachments
      await loadAttachments();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.includes('pdf')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[98vw] max-h-[95vh] overflow-hidden p-0 rounded-none border-0 shadow-none [&_.absolute]:text-white [&_.absolute_button]:text-white [&_.absolute_svg]:text-white [&_.absolute_button:hover]:bg-white/20 [&_.absolute_button]:opacity-100 [&_.absolute_button]:hover:opacity-100">
        <div className="backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/85 border-0 shadow-2xl overflow-hidden rounded-none">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Comments & Discussion</h2>
                  <p className="text-white/90">{taskTitle}</p>
                  <p className="text-white/70 text-sm">{projectName}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                <MessageSquare className="w-3 h-3 mr-1" />
                {comments.length} comments
              </Badge>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="flex h-full">
            {/* Left Side - Comments */}
            <div className="w-[60%] overflow-y-auto p-8 max-h-[calc(95vh-120px)]">

            {/* Comments List */}
            <div className="space-y-4 mb-6">
              {comments.length === 0 ? (
                <div className="text-center py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl border-2 border-blue-200">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-blue-700 font-semibold text-sm mb-1">No comments yet</p>
                  <p className="text-blue-600 text-xs">Start the discussion by adding a comment</p>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <div key={comment.id} className={`group rounded-xl border-2 hover:shadow-lg transition-all duration-300 p-4 ${
                    index % 2 === 0 
                      ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 hover:border-blue-300' 
                      : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-purple-200 hover:border-purple-300'
                  }`}>
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10 ring-2 ring-white shadow-sm">
                        <AvatarImage src={comment.author.avatar} />
                        <AvatarFallback className={`font-semibold text-white ${
                          index % 2 === 0 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}>
                          {comment.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className={`font-semibold text-sm transition-colors ${
                              index % 2 === 0 
                                ? 'text-blue-800 group-hover:text-blue-900' 
                                : 'text-purple-800 group-hover:text-purple-900'
                            }`}>
                              {comment.author.name}
                            </span>
                            <Badge variant="outline" className={`text-xs ${
                              index % 2 === 0 
                                ? 'bg-blue-100 text-blue-700 border-blue-300' 
                                : 'bg-purple-100 text-purple-700 border-purple-300'
                            }`}>
                              Author
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-600 font-medium">
                            {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                        <div className={`rounded-lg p-3 border ${
                          index % 2 === 0 
                            ? 'bg-gradient-to-r from-white to-blue-50 border-blue-100' 
                            : 'bg-gradient-to-r from-white to-purple-50 border-purple-100'
                        }`}>
                          <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-3">
                          <button className={`text-xs transition-colors flex items-center space-x-1 ${
                            index % 2 === 0 
                              ? 'text-blue-600 hover:text-blue-800' 
                              : 'text-purple-600 hover:text-purple-800'
                          }`}>
                            <MessageSquare className="w-3 h-3" />
                            <span>Reply</span>
                          </button>
                          <button className="text-xs text-green-600 hover:text-green-800 transition-colors flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Like</span>
                          </button>
                          <button className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1">
                            <X className="w-3 h-3" />
                            <span>Report</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <div className="border-t border-gray-200 pt-6">
              <form onSubmit={handleSubmitComment} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="comment-text" className="text-sm font-semibold text-gray-700">
                    Add a comment
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="comment-text"
                      value={commentData.text}
                      onChange={(e) => setCommentData({ text: e.target.value })}
                      placeholder="Write your comment here..."
                      className="min-h-[120px] bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900"
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleFileSelect}
                    disabled={isUploading}
                    className="font-semibold transition-all duration-200 rounded-xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 px-6 py-3"
                  >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach File
                  </Button>
                  <Button 
                    type="submit" 
                    className="font-semibold transition-all duration-200 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-purple-500 text-white hover:from-purple-700 hover:via-blue-700 hover:to-purple-600 shadow-lg hover:shadow-xl px-6 py-3"
                    disabled={isLoading || !commentData.text.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Post Comment
                  </Button>
                </div>
              </form>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Right Side - Attachments */}
          <div className="w-[40%] border-l border-gray-200 bg-gradient-to-br from-gray-50 to-purple-50 p-8 max-h-[95vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Header matching left side structure */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Paperclip className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Attachments</h2>
                    <p className="text-sm text-muted-foreground">File Management</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {attachments.length} files
                </Badge>
              </div>

              {attachments.length === 0 ? (
                <div className="text-center py-8">
                  <Paperclip className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500 text-sm">No attachments yet</p>
                  <p className="text-gray-400 text-xs mt-1">Upload files to share with the team</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="group bg-gradient-to-r from-white to-gray-50 rounded-xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl flex items-center justify-center border-2 border-purple-200 group-hover:border-purple-300 transition-colors">
                            {getFileIcon(attachment.file_type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors">
                              {attachment.filename}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 rounded-lg hover:bg-purple-50 text-purple-600 hover:text-purple-700 transition-colors"
                                onClick={() => window.open(attachment.download_url, '_blank')}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span className="font-medium">{formatFileSize(attachment.file_size)}</span>
                            <span className="font-medium">by {attachment.uploaded_by.name}</span>
                          </div>
                          <div className="text-xs text-gray-400 font-medium">
                            {format(new Date(attachment.uploaded_at), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span className="text-sm font-semibold text-indigo-600">Uploading files...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  );
};

export default TaskCommentsModal; 