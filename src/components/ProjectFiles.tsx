import { useState } from "react";
import {
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File,
  Download,
  Trash2,
  Eye,
  Share2,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  HardDrive,
  FolderOpen,
  X,
  Upload,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface ProjectFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  size: string;
  uploadedBy: string;
  uploadDate: string;
  lastModified: string;
  downloads: number;
  description?: string;
  tags: string[];
  status: 'active' | 'archived' | 'deleted';
}

interface ProjectFilesProps {
  projectId: number;
  projectName: string;
}

const ProjectFiles = ({ projectId, projectName }: ProjectFilesProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'downloads'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadFormData, setUploadFormData] = useState({
    fileName: '',
    description: '',
    tags: ''
  });

  // Mock data for project files
  const mockFiles: ProjectFile[] = [
    {
      id: '1',
      name: 'Q1_Budget_Planning_Document.pdf',
      type: 'document',
      size: '2.4 MB',
      uploadedBy: 'Jane Smith',
      uploadDate: '2024-01-15',
      lastModified: '2024-01-18',
      downloads: 12,
      description: 'Comprehensive Q1 budget planning document with detailed breakdown',
      tags: ['budget', 'planning', 'finance'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Project_Timeline_Chart.png',
      type: 'image',
      size: '1.8 MB',
      uploadedBy: 'John Doe',
      uploadDate: '2024-01-16',
      lastModified: '2024-01-16',
      downloads: 8,
      description: 'Visual timeline chart showing project milestones',
      tags: ['timeline', 'chart', 'milestones'],
      status: 'active'
    },
    {
      id: '3',
      name: 'Team_Meeting_Recording.mp4',
      type: 'video',
      size: '45.2 MB',
      uploadedBy: 'Alice Johnson',
      uploadDate: '2024-01-17',
      lastModified: '2024-01-17',
      downloads: 15,
      description: 'Recording of the weekly team meeting discussing project progress',
      tags: ['meeting', 'recording', 'team'],
      status: 'active'
    },
    {
      id: '4',
      name: 'Budget_Spreadsheet.xlsx',
      type: 'document',
      size: '856 KB',
      uploadedBy: 'Jane Smith',
      uploadDate: '2024-01-14',
      lastModified: '2024-01-19',
      downloads: 23,
      description: 'Detailed budget spreadsheet with formulas and calculations',
      tags: ['budget', 'spreadsheet', 'calculations'],
      status: 'active'
    },
    {
      id: '5',
      name: 'Project_Assets.zip',
      type: 'archive',
      size: '12.7 MB',
      uploadedBy: 'Bob Wilson',
      uploadDate: '2024-01-13',
      lastModified: '2024-01-13',
      downloads: 5,
      description: 'Compressed folder containing all project assets and resources',
      tags: ['assets', 'resources', 'archive'],
      status: 'active'
    },
    {
      id: '6',
      name: 'Design_Mockups.psd',
      type: 'document',
      size: '8.9 MB',
      uploadedBy: 'Sarah Chen',
      uploadDate: '2024-01-12',
      lastModified: '2024-01-15',
      downloads: 7,
      description: 'Photoshop design mockups for the project interface',
      tags: ['design', 'mockups', 'photoshop'],
      status: 'active'
    },
    {
      id: '7',
      name: 'Project_Report_Presentation.pptx',
      type: 'document',
      size: '3.2 MB',
      uploadedBy: 'Mike Brown',
      uploadDate: '2024-01-11',
      lastModified: '2024-01-16',
      downloads: 18,
      description: 'PowerPoint presentation for project status report',
      tags: ['presentation', 'report', 'status'],
      status: 'active'
    },
    {
      id: '8',
      name: 'Team_Photo.jpg',
      type: 'image',
      size: '2.1 MB',
      uploadedBy: 'Alice Johnson',
      uploadDate: '2024-01-10',
      lastModified: '2024-01-10',
      downloads: 3,
      description: 'Team photo for project documentation',
      tags: ['team', 'photo', 'documentation'],
      status: 'active'
    }
  ];

  const [files, setFiles] = useState<ProjectFile[]>(mockFiles);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-6 h-6" />;
      case 'image':
        return <Image className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'audio':
        return <Music className="w-6 h-6" />;
      case 'archive':
        return <Archive className="w-6 h-6" />;
      default:
        return <File className="w-6 h-6" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'text-blue-600 bg-blue-50';
      case 'image':
        return 'text-green-600 bg-green-50';
      case 'video':
        return 'text-purple-600 bg-purple-50';
      case 'audio':
        return 'text-orange-600 bg-orange-50';
      case 'archive':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || file.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size);
      case 'downloads':
        return b.downloads - a.downloads;
      default:
        return 0;
    }
  });

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDownload = (file: ProjectFile) => {
    // Create a download link and trigger download
    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(`This is a simulated download of ${file.name}`)}`;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    alert(`Downloading ${file.name}...`);
  };

  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setSelectedFiles(prev => prev.filter(id => id !== fileId));
  };

  const handleFileClick = (file: ProjectFile) => {
    setSelectedFile(file);
    setShowFileDetails(true);
  };

  const handleFileAction = (file: ProjectFile, action: string) => {
    // Prevent card details from opening when other actions are triggered
    event?.stopPropagation();
    setSelectedFile(file);
    
    switch (action) {
      case 'preview':
        setShowPreviewModal(true);
        break;
      case 'share':
        setShowShareModal(true);
        break;
      case 'download':
        handleDownload(file);
        break;
      case 'delete':
        handleDelete(file.id);
        break;
    }
  };

  const handlePreview = (file: ProjectFile) => {
    setSelectedFile(file);
    setShowPreviewModal(true);
  };

  const handleShare = (file: ProjectFile) => {
    setSelectedFile(file);
    setShowShareModal(true);
  };

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload triggered', event.target.files);
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size);
      setUploadedFile(file);
      setUploadFormData(prev => ({
        ...prev,
        fileName: file.name
      }));
    } else {
      console.log('No file selected');
    }
  };

  const handleUploadSubmit = () => {
    if (uploadedFile) {
      // Create a new file entry
      const newFile: ProjectFile = {
        id: Date.now().toString(),
        name: uploadFormData.fileName || uploadedFile.name,
        type: uploadedFile.type.includes('image') ? 'image' : 
              uploadedFile.type.includes('video') ? 'video' : 
              uploadedFile.type.includes('audio') ? 'audio' : 
              uploadedFile.type.includes('zip') ? 'archive' : 'document',
        size: `${(uploadedFile.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedBy: 'Current User',
        uploadDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        downloads: 0,
        description: uploadFormData.description,
        tags: uploadFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: 'active'
      };

      setFiles(prev => [newFile, ...prev]);
      setUploadedFile(null);
      setUploadFormData({ fileName: '', description: '', tags: '' });
      setShowUploadModal(false);
      alert('File uploaded successfully!');
    }
  };

  const handleBulkDownload = () => {
    if (selectedFiles.length > 0) {
      const filesToDownload = files.filter(file => selectedFiles.includes(file.id));
      console.log('Downloading multiple files:', filesToDownload.map(f => f.name));
      alert(`Downloading ${selectedFiles.length} files...`);
    }
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length > 0) {
      if (confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
        setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
        setSelectedFiles([]);
        alert(`${selectedFiles.length} files deleted successfully!`);
      }
    }
  };

  const totalSize = files.reduce((acc, file) => {
    const size = parseFloat(file.size.split(' ')[0]);
    return acc + size;
  }, 0);

  const fileTypeStats = files.reduce((acc, file) => {
    acc[file.type] = (acc[file.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Files</div>
              <div className="text-2xl font-bold text-foreground">{files.length}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <HardDrive className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Size</div>
              <div className="text-2xl font-bold text-foreground">{totalSize.toFixed(1)} MB</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Downloads</div>
              <div className="text-2xl font-bold text-foreground">
                {files.reduce((acc, file) => acc + file.downloads, 0)}
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FolderOpen className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">File Types</div>
              <div className="text-2xl font-bold text-foreground">{Object.keys(fileTypeStats).length}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType('all')}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('document')}>Documents</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('image')}>Images</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('video')}>Videos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('audio')}>Audio</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('archive')}>Archives</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('date')}>Date</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('size')}>Size</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('downloads')}>Downloads</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleUpload}
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>
      </div>

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedFiles.map((file) => (
            <Card 
              key={file.id} 
              className={`p-4 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleFileClick(file)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${getFileTypeColor(file.type)}`}>
                  {getFileIcon(file.type)}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ⋯
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleFileAction(file, 'download');
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleFileAction(file, 'preview');
                    }}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleFileAction(file, 'share');
                    }}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction(file, 'delete');
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-sm truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {file.description || 'No description'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{file.size}</span>
                  <span>{file.downloads} downloads</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {formatDate(file.uploadDate)}
                  </span>
                  <span className="text-muted-foreground">
                    {file.uploadedBy}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {file.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {file.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{file.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedFiles.map((file) => (
            <Card 
              key={file.id} 
              className={`p-4 hover:bg-gray-50 transition-all duration-300 cursor-pointer ${
                selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleFileClick(file)}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${getFileTypeColor(file.type)}`}>
                  {getFileIcon(file.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{file.size}</span>
                      <span className="text-sm text-muted-foreground">{file.downloads} downloads</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate">
                    {file.description || 'No description'}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                    <span>Uploaded by {file.uploadedBy}</span>
                    <span>Modified {formatDate(file.lastModified)}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {file.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ⋯
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleFileAction(file, 'download');
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleFileAction(file, 'preview');
                    }}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleFileAction(file, 'share');
                    }}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction(file, 'delete');
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* File Type Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">File Type Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(fileTypeStats).map(([type, count]) => (
            <div key={type} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-2 ${getFileTypeColor(type)}`}>
                {getFileIcon(type)}
              </div>
              <div className="text-sm font-medium text-foreground">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
              <div className="text-2xl font-bold text-foreground">{count}</div>
            </div>
          ))}
                 </div>
       </Card>

       {/* File Details Modal */}
       {showFileDetails && selectedFile && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden border border-gray-100">
             {/* Header */}
             <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <div className={`p-2 rounded-lg ${getFileTypeColor(selectedFile.type)}`}>
                     {getFileIcon(selectedFile.type)}
                   </div>
                   <div className="flex-1 min-w-0">
                     <h2 className="text-lg font-bold truncate">{selectedFile.name}</h2>
                     <p className="text-blue-100 text-sm truncate">{selectedFile.description}</p>
                   </div>
                 </div>
                 <Button 
                   variant="ghost" 
                   size="sm"
                   className="text-white hover:bg-white/20 rounded-full p-2 ml-2"
                   onClick={() => setShowFileDetails(false)}
                 >
                   <X className="w-4 h-4" />
                 </Button>
               </div>
             </div>

             {/* Content */}
             <div className="p-4 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-3">
                   <h3 className="font-semibold text-gray-900 text-sm">File Information</h3>
                   <div className="space-y-2">
                     <div className="flex justify-between items-center py-1">
                       <span className="text-gray-600 text-sm">Size:</span>
                       <span className="font-medium text-sm">{selectedFile.size}</span>
                     </div>
                     <div className="flex justify-between items-center py-1">
                       <span className="text-gray-600 text-sm">Type:</span>
                       <span className="font-medium text-sm capitalize">{selectedFile.type}</span>
                     </div>
                     <div className="flex justify-between items-center py-1">
                       <span className="text-gray-600 text-sm">Downloads:</span>
                       <span className="font-medium text-sm">{selectedFile.downloads}</span>
                     </div>
                     <div className="flex justify-between items-center py-1">
                       <span className="text-gray-600 text-sm">Status:</span>
                       <Badge variant="outline" className="text-xs">{selectedFile.status}</Badge>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <h3 className="font-semibold text-gray-900 text-sm">Upload Information</h3>
                   <div className="space-y-2">
                     <div className="flex justify-between items-center py-1">
                       <span className="text-gray-600 text-sm">Uploaded by:</span>
                       <span className="font-medium text-sm">{selectedFile.uploadedBy}</span>
                     </div>
                     <div className="flex justify-between items-center py-1">
                       <span className="text-gray-600 text-sm">Upload date:</span>
                       <span className="font-medium text-sm">{formatDate(selectedFile.uploadDate)}</span>
                     </div>
                     <div className="flex justify-between items-center py-1">
                       <span className="text-gray-600 text-sm">Last modified:</span>
                       <span className="font-medium text-sm">{formatDate(selectedFile.lastModified)}</span>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="space-y-2">
                 <h3 className="font-semibold text-gray-900 text-sm">Tags</h3>
                 <div className="flex flex-wrap gap-1">
                   {selectedFile.tags.map((tag, index) => (
                     <Badge key={index} variant="secondary" className="text-xs">
                       {tag}
                     </Badge>
                   ))}
                 </div>
               </div>

               <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
                 <Button 
                   variant="outline" 
                   size="sm"
                   onClick={() => setShowFileDetails(false)}
                   className="px-4 py-2"
                 >
                   Close
                 </Button>
                 <Button 
                   size="sm"
                   onClick={() => handleDownload(selectedFile)}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                 >
                   <Download className="w-4 h-4 mr-2" />
                   Download
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Upload Modal */}
       {showUploadModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-gray-100">
             {/* Header */}
             <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <div className="p-2 bg-white/20 rounded-lg">
                     <FileText className="w-6 h-6" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-bold">Upload File</h2>
                     <p className="text-blue-100 text-sm">Add new files to your project</p>
                   </div>
                 </div>
                 <Button 
                   variant="ghost" 
                   size="sm"
                   className="text-white hover:bg-white/20 rounded-full p-2"
                   onClick={() => setShowUploadModal(false)}
                 >
                   <X className="w-5 h-5" />
                 </Button>
               </div>
             </div>

             {/* Content */}
             <div className="p-6 space-y-6">
               {/* File Upload Area */}
               <div 
                 className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                   uploadedFile 
                     ? 'border-green-300 bg-green-50' 
                     : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                 }`}
                 onDragOver={(e) => {
                   e.preventDefault();
                   e.currentTarget.classList.add('border-blue-400', 'bg-blue-50', 'scale-105');
                 }}
                 onDragLeave={(e) => {
                   e.preventDefault();
                   e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50', 'scale-105');
                 }}
                 onDrop={(e) => {
                   e.preventDefault();
                   e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50', 'scale-105');
                   const files = e.dataTransfer.files;
                   if (files.length > 0) {
                     const file = files[0];
                     setUploadedFile(file);
                     setUploadFormData(prev => ({
                       ...prev,
                       fileName: file.name
                     }));
                   }
                 }}
               >
                 {!uploadedFile ? (
                   <>
                     <div className="mb-6">
                       <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                         <FileText className="w-10 h-10 text-blue-600" />
                       </div>
                       <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop your files here</h3>
                       <p className="text-gray-600 mb-4">Drag and drop files to upload, or click to browse</p>
                     </div>
                     
                     <input
                       type="file"
                       id="file-upload"
                       className="hidden"
                       onChange={handleFileUpload}
                       accept="*/*"
                       multiple={false}
                     />
                     <label htmlFor="file-upload">
                       <Button 
                         type="button"
                         className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                         onClick={() => {
                           const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                           if (fileInput) {
                             fileInput.click();
                           }
                         }}
                       >
                         <Upload className="w-5 h-5 mr-2" />
                         Choose Files
                       </Button>
                     </label>
                   </>
                 ) : (
                   <div className="space-y-4">
                     <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                       <CheckCircle className="w-8 h-8 text-green-600" />
                     </div>
                     <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                       <div className="flex items-center space-x-3">
                         <div className="p-2 bg-green-100 rounded-lg">
                           <FileText className="w-5 h-5 text-green-600" />
                         </div>
                         <div className="flex-1 text-left">
                           <p className="font-medium text-gray-900 truncate">{uploadedFile.name}</p>
                           <p className="text-sm text-gray-500">
                             {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                           </p>
                         </div>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => {
                             setUploadedFile(null);
                             setUploadFormData({ fileName: '', description: '', tags: '' });
                           }}
                           className="text-gray-400 hover:text-red-500"
                         >
                           <X className="w-4 h-4" />
                         </Button>
                       </div>
                     </div>
                     <Button
                       variant="outline"
                       onClick={() => {
                         const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                         if (fileInput) {
                           fileInput.click();
                         }
                       }}
                       className="text-blue-600 border-blue-200 hover:bg-blue-50"
                     >
                       <Upload className="w-4 h-4 mr-2" />
                       Choose Different File
                     </Button>
                   </div>
                 )}
               </div>

               {/* File Details Form */}
               {uploadedFile && (
                 <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         File Name
                       </label>
                       <Input 
                         placeholder="Enter file name..." 
                         value={uploadFormData.fileName}
                         onChange={(e) => setUploadFormData(prev => ({ ...prev, fileName: e.target.value }))}
                         className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         File Type
                       </label>
                       <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                         <span className="text-sm text-gray-600 capitalize">
                           {uploadedFile.type || 'Unknown'}
                         </span>
                       </div>
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">
                       Description
                     </label>
                     <textarea 
                       className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:ring-blue-500"
                       rows={3}
                       placeholder="Describe what this file contains..."
                       value={uploadFormData.description}
                       onChange={(e) => setUploadFormData(prev => ({ ...prev, description: e.target.value }))}
                     />
                   </div>
                   
                   <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">
                       Tags
                     </label>
                     <Input 
                       placeholder="Enter tags separated by commas (e.g., design, mockup, final)" 
                       value={uploadFormData.tags}
                       onChange={(e) => setUploadFormData(prev => ({ ...prev, tags: e.target.value }))}
                       className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                     />
                     <p className="text-xs text-gray-500 mt-1">
                       Tags help organize and find files easily
                     </p>
                   </div>
                 </div>
               )}

               {/* Action Buttons */}
               <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                 <Button 
                   variant="outline" 
                   onClick={() => {
                     setShowUploadModal(false);
                     setUploadedFile(null);
                     setUploadFormData({ fileName: '', description: '', tags: '' });
                   }}
                   className="px-6 py-2"
                 >
                   Cancel
                 </Button>
                 <Button 
                   onClick={handleUploadSubmit}
                   disabled={!uploadedFile}
                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                 >
                   <Upload className="w-4 h-4 mr-2" />
                   Upload File
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Share Modal */}
       {showShareModal && selectedFile && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-y-auto">
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-foreground">Share File</h2>
                 <Button variant="ghost" onClick={() => setShowShareModal(false)}>
                   ✕
                 </Button>
               </div>

               <div className="space-y-4">
                 <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                   <div className={`p-2 rounded-lg ${getFileTypeColor(selectedFile.type)}`}>
                     {getFileIcon(selectedFile.type)}
                   </div>
                   <div>
                     <p className="font-medium">{selectedFile.name}</p>
                     <p className="text-sm text-muted-foreground">{selectedFile.size}</p>
                   </div>
                 </div>

                 <div className="space-y-3">
                   <div>
                     <label className="block text-sm font-medium text-foreground mb-2">Share with</label>
                     <Input placeholder="Enter email addresses..." />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-foreground mb-2">Message (optional)</label>
                     <textarea 
                       className="w-full p-3 border rounded-lg resize-none"
                       rows={3}
                       placeholder="Add a message..."
                     />
                   </div>
                   <div className="flex items-center space-x-2">
                     <input type="checkbox" id="allow-download" defaultChecked />
                     <label htmlFor="allow-download" className="text-sm">Allow download</label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <input type="checkbox" id="allow-edit" />
                     <label htmlFor="allow-edit" className="text-sm">Allow edit</label>
                   </div>
                 </div>

                 <div className="flex justify-end space-x-3 pt-6 border-t">
                   <Button variant="outline" onClick={() => setShowShareModal(false)}>
                     Cancel
                   </Button>
                   <Button onClick={() => {
                     alert('File shared successfully!');
                     setShowShareModal(false);
                   }}>
                     Share File
                   </Button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Preview Modal */}
       {showPreviewModal && selectedFile && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] overflow-y-auto">
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center space-x-3">
                   <div className={`p-2 rounded-lg ${getFileTypeColor(selectedFile.type)}`}>
                     {getFileIcon(selectedFile.type)}
                   </div>
                   <h2 className="text-xl font-bold text-foreground">{selectedFile.name}</h2>
                 </div>
                 <Button variant="ghost" onClick={() => setShowPreviewModal(false)}>
                   ✕
                 </Button>
               </div>

               <div className="border rounded-lg p-8 text-center bg-gray-50">
                 {selectedFile.type === 'image' ? (
                   <div className="space-y-4">
                     <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                       <Image className="w-16 h-16 text-gray-400" />
                     </div>
                     <p className="text-muted-foreground">Image preview would be displayed here</p>
                   </div>
                 ) : selectedFile.type === 'video' ? (
                   <div className="space-y-4">
                     <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                       <Video className="w-16 h-16 text-gray-400" />
                     </div>
                     <p className="text-muted-foreground">Video player would be displayed here</p>
                   </div>
                 ) : (
                   <div className="space-y-4">
                     <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                       <FileText className="w-16 h-16 text-gray-400" />
                     </div>
                     <p className="text-muted-foreground">Document preview would be displayed here</p>
                   </div>
                 )}
               </div>

               <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                 <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                   Close
                 </Button>
                 <Button onClick={() => handleDownload(selectedFile)}>
                   <Download className="w-4 h-4 mr-2" />
                   Download
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

 export default ProjectFiles; 