// // import { useState, useEffect } from "react";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import {
// //   Tabs,
// //   TabsContent,
// //   TabsList,
// //   TabsTrigger,
// // } from "@/components/ui/tabs";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   Settings,
// //   Globe,
// //   Layout,
// //   Layers,
// //   Share2,
// //   Phone,
// //   Save,
// //   ArrowLeft,
// //   Image as ImageIcon,
// // } from "lucide-react";
// // import makeApiRequest from "@/services/axios";
// // import { useNavigate } from "react-router-dom";
// // import { toast } from "sonner";

// // // Types
// // interface Setting {
// //   id: number;
// //   key: string;
// //   value: string | null;
// //   type: string;
// //   group: string;
// //   description: string;
// //   created_at: string;
// //   updated_at: string;
// // }

// // interface SettingsData {
// //   general: Setting[];
// //   header: Setting[];
// //   footer: Setting[];
// //   social: Setting[];
// //   contact: Setting[];
// // }

// // interface SettingsResponse {
// //   success: boolean;
// //   data: SettingsData;
// // }

// // const GetAllSettings = () => {
// //   const navigate = useNavigate();
// //   const [data, setData] = useState<SettingsData | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [editedValues, setEditedValues] = useState<Record<string, string>>({});

// //   const fetchSettings = async () => {
// //     try {
// //       setLoading(true);
// //       const response: SettingsResponse = await makeApiRequest(
// //         "admin/cms/settings",
// //         {
// //           method: "GET",
// //         }
// //       );

// //       console.log("Settings Response:", response);

// //       if (response?.success && response?.data) {
// //         setData(response.data);
        
// //         // Initialize edited values with current values
// //         const initialValues: Record<string, string> = {};
// //         Object.values(response.data).flat().forEach((setting) => {
// //           initialValues[setting.key] = setting.value || "";
// //         });
// //         setEditedValues(initialValues);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching settings:", error);
// //       toast.error("Failed to load settings");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchSettings();
// //   }, []);

// //   const handleInputChange = (key: string, value: string) => {
// //     setEditedValues((prev) => ({
// //       ...prev,
// //       [key]: value,
// //     }));
// //   };

// //   const handleSave = async () => {
// //     try {
// //       setSaving(true);
// //       // Here you would call your update API
// //       // await makeApiRequest("admin/cms/settings", {
// //       //   method: "PUT",
// //       //   data: editedValues,
// //       // });
      
// //       toast.success("Settings updated successfully");
// //       await fetchSettings();
// //     } catch (error) {
// //       console.error("Error saving settings:", error);
// //       toast.error("Failed to save settings");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const renderSettingInput = (setting: Setting) => {
// //     const value = editedValues[setting.key] || "";

// //     switch (setting.type) {
// //       case "textarea":
// //         return (
// //           <Textarea
// //             id={setting.key}
// //             value={value}
// //             onChange={(e) => handleInputChange(setting.key, e.target.value)}
// //             placeholder={setting.description}
// //             rows={4}
// //             className="focus:ring-2 focus:ring-green-500"
// //           />
// //         );

// //       case "boolean":
// //         return (
// //           <div className="flex items-center space-x-2">
// //             <input
// //               type="checkbox"
// //               id={setting.key}
// //               checked={value === "true"}
// //               onChange={(e) =>
// //                 handleInputChange(setting.key, e.target.checked.toString())
// //               }
// //               className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
// //             />
// //             <Label htmlFor={setting.key} className="text-sm text-gray-600">
// //               Enable {setting.description}
// //             </Label>
// //           </div>
// //         );

// //       case "image":
// //         return (
// //           <div className="space-y-2">
// //             <Input
// //               id={setting.key}
// //               type="file"
// //               accept="image/*"
// //               className="focus:ring-2 focus:ring-green-500"
// //             />
// //             {value && (
// //               <div className="mt-2">
// //                 <img
// //                   src={value}
// //                   alt={setting.description}
// //                   className="h-20 w-20 object-cover rounded border"
// //                 />
// //               </div>
// //             )}
// //           </div>
// //         );

// //       case "json":
// //         return (
// //           <Textarea
// //             id={setting.key}
// //             value={value}
// //             onChange={(e) => handleInputChange(setting.key, e.target.value)}
// //             placeholder={setting.description}
// //             rows={8}
// //             className="font-mono text-sm focus:ring-2 focus:ring-green-500"
// //           />
// //         );

// //       default:
// //         return (
// //           <Input
// //             id={setting.key}
// //             type="text"
// //             value={value}
// //             onChange={(e) => handleInputChange(setting.key, e.target.value)}
// //             placeholder={setting.description}
// //             className="focus:ring-2 focus:ring-green-500"
// //           />
// //         );
// //     }
// //   };

// //   const renderSettingsGroup = (settings: Setting[]) => {
// //     return (
// //       <div className="space-y-6">
// //         {settings.map((setting) => (
// //           <div key={setting.id} className="space-y-2">
// //             <Label htmlFor={setting.key} className="text-sm font-semibold">
// //               {setting.description}
// //               {setting.type === "json" && (
// //                 <Badge variant="outline" className="ml-2 text-xs">
// //                   JSON
// //                 </Badge>
// //               )}
// //               {setting.type === "image" && (
// //                 <Badge variant="outline" className="ml-2 text-xs">
// //                   Image
// //                 </Badge>
// //               )}
// //             </Label>
// //             {renderSettingInput(setting)}
// //             <p className="text-xs text-gray-500">Key: {setting.key}</p>
// //           </div>
// //         ))}
// //       </div>
// //     );
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
// //         <div className="space-y-6 p-6">
// //           <div className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
// //           <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!data) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
// //         <div className="flex items-center justify-center h-96">
// //           <div className="text-center">
// //             <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
// //             <p className="text-xl font-semibold text-gray-600">
// //               No settings available
// //             </p>
// //             <Button
// //               onClick={() => navigate(-1)}
// //               variant="outline"
// //               className="mt-4"
// //             >
// //               <ArrowLeft className="h-4 w-4 mr-2" />
// //               Go Back
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
// //       <div className="space-y-6 p-6">
// //         {/* Header */}
// //         <div className="flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <Button
// //               variant="outline"
// //               size="sm"
// //               onClick={() => navigate(-1)}
// //               className="hover:bg-slate-100 dark:hover:bg-slate-800"
// //             >
// //               <ArrowLeft className="mr-2 h-4 w-4" />
// //               Back
// //             </Button>
// //             <div>
// //               <div className="flex items-center gap-3">
// //                 <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
// //                   <Settings className="h-6 w-6 text-white" />
// //                 </div>
// //                 <div>
// //                   <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
// //                     CMS Settings
// //                   </h1>
// //                   <p className="text-muted-foreground">
// //                     Manage your website configuration and content
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <Button
// //             onClick={handleSave}
// //             disabled={saving}
// //             className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
// //           >
// //             <Save className="h-4 w-4 mr-2" />
// //             {saving ? "Saving..." : "Save Changes"}
// //           </Button>
// //         </div>

// //         {/* Settings Tabs */}
// //         <Card className="border-2 border-green-100 dark:border-green-900">
// //           <CardContent className="p-6">
// //             <Tabs defaultValue="general" className="w-full">
// //               <TabsList className="grid w-full grid-cols-5 mb-8">
// //                 <TabsTrigger
// //                   value="general"
// //                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
// //                 >
// //                   <Globe className="h-4 w-4 mr-2" />
// //                   General
// //                 </TabsTrigger>
// //                 <TabsTrigger
// //                   value="header"
// //                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
// //                 >
// //                   <Layout className="h-4 w-4 mr-2" />
// //                   Header
// //                 </TabsTrigger>
// //                 <TabsTrigger
// //                   value="footer"
// //                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
// //                 >
// //                   <Layers className="h-4 w-4 mr-2" />
// //                   Footer
// //                 </TabsTrigger>
// //                 <TabsTrigger
// //                   value="social"
// //                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
// //                 >
// //                   <Share2 className="h-4 w-4 mr-2" />
// //                   Social
// //                 </TabsTrigger>
// //                 <TabsTrigger
// //                   value="contact"
// //                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
// //                 >
// //                   <Phone className="h-4 w-4 mr-2" />
// //                   Contact
// //                 </TabsTrigger>
// //               </TabsList>

// //               {/* General Settings */}
// //               <TabsContent value="general">
// //                 <Card>
// //                   <CardHeader>
// //                     <CardTitle className="flex items-center gap-2">
// //                       <Globe className="h-5 w-5 text-green-600" />
// //                       General Settings
// //                     </CardTitle>
// //                     <CardDescription>
// //                       Basic website information and branding
// //                     </CardDescription>
// //                   </CardHeader>
// //                   <CardContent>
// //                     {renderSettingsGroup(data.general)}
// //                   </CardContent>
// //                 </Card>
// //               </TabsContent>

// //               {/* Header Settings */}
// //               <TabsContent value="header">
// //                 <Card>
// //                   <CardHeader>
// //                     <CardTitle className="flex items-center gap-2">
// //                       <Layout className="h-5 w-5 text-green-600" />
// //                       Header Settings
// //                     </CardTitle>
// //                     <CardDescription>
// //                       Configure header style and navigation menu
// //                     </CardDescription>
// //                   </CardHeader>
// //                   <CardContent>
// //                     {renderSettingsGroup(data.header)}
// //                   </CardContent>
// //                 </Card>
// //               </TabsContent>

// //               {/* Footer Settings */}
// //               <TabsContent value="footer">
// //                 <Card>
// //                   <CardHeader>
// //                     <CardTitle className="flex items-center gap-2">
// //                       <Layers className="h-5 w-5 text-green-600" />
// //                       Footer Settings
// //                     </CardTitle>
// //                     <CardDescription>
// //                       Footer content and navigation links
// //                     </CardDescription>
// //                   </CardHeader>
// //                   <CardContent>
// //                     {renderSettingsGroup(data.footer)}
// //                   </CardContent>
// //                 </Card>
// //               </TabsContent>

// //               {/* Social Media Settings */}
// //               <TabsContent value="social">
// //                 <Card>
// //                   <CardHeader>
// //                     <CardTitle className="flex items-center gap-2">
// //                       <Share2 className="h-5 w-5 text-green-600" />
// //                       Social Media Settings
// //                     </CardTitle>
// //                     <CardDescription>
// //                       Social media profile links
// //                     </CardDescription>
// //                   </CardHeader>
// //                   <CardContent>
// //                     {renderSettingsGroup(data.social)}
// //                   </CardContent>
// //                 </Card>
// //               </TabsContent>

// //               {/* Contact Settings */}
// //               <TabsContent value="contact">
// //                 <Card>
// //                   <CardHeader>
// //                     <CardTitle className="flex items-center gap-2">
// //                       <Phone className="h-5 w-5 text-green-600" />
// //                       Contact Settings
// //                     </CardTitle>
// //                     <CardDescription>
// //                       Contact information and addresses
// //                     </CardDescription>
// //                   </CardHeader>
// //                   <CardContent>
// //                     {renderSettingsGroup(data.contact)}
// //                   </CardContent>
// //                 </Card>
// //               </TabsContent>
// //             </Tabs>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };

// // export default GetAllSettings;

















// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import {
//   Settings,
//   Globe,
//   Layout,
//   Layers,
//   Share2,
//   Phone,
//   Save,
//   ArrowLeft,
//   Plus,
//   Trash2,
//   GripVertical,
// } from "lucide-react";
// import makeApiRequest from "@/services/axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// // Types
// interface Setting {
//   id: number;
//   key: string;
//   value: any;
//   type: string;
//   group: string;
//   description: string;
//   created_at: string;
//   updated_at: string;
// }

// interface MenuItem {
//   label: string;
//   url: string;
//   order: number;
// }

// interface SettingsData {
//   general: Setting[];
//   header: Setting[];
//   footer: Setting[];
//   social: Setting[];
//   contact: Setting[];
// }

// interface SettingsResponse {
//   success: boolean;
//   data: SettingsData;
// }

// const GetAllSettings = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState<SettingsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [editedValues, setEditedValues] = useState<Record<string, any>>({});

//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       const response: SettingsResponse = await makeApiRequest(
//         "admin/cms/settings",
//         {
//           method: "GET",
//         }
//       );

//       console.log("Settings Response:", response);

//       if (response?.success && response?.data) {
//         setData(response.data);

//         // Initialize edited values with current values
//         const initialValues: Record<string, any> = {};
//         Object.values(response.data)
//           .flat()
//           .forEach((setting) => {
//             initialValues[setting.key] = setting.value || "";
//           });
//         setEditedValues(initialValues);
//       }
//     } catch (error) {
//       console.error("Error fetching settings:", error);
//       toast.error("Failed to load settings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const handleInputChange = (key: string, value: any) => {
//     setEditedValues((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       // Here you would call your update API
//       // await makeApiRequest("admin/cms/settings", {
//       //   method: "PUT",
//       //   data: editedValues,
//       // });

//       toast.success("Settings updated successfully");
//       await fetchSettings();
//     } catch (error) {
//       console.error("Error saving settings:", error);
//       toast.error("Failed to save settings");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Menu Item Handlers
//   const handleMenuItemChange = (
//     settingKey: string,
//     index: number,
//     field: keyof MenuItem,
//     value: string | number
//   ) => {
//     const currentMenu = [...(editedValues[settingKey] || [])];
//     currentMenu[index] = {
//       ...currentMenu[index],
//       [field]: value,
//     };
//     handleInputChange(settingKey, currentMenu);
//   };

//   const handleAddMenuItem = (settingKey: string) => {
//     const currentMenu = [...(editedValues[settingKey] || [])];
//     const newOrder = currentMenu.length + 1;
//     currentMenu.push({
//       label: "New Menu Item",
//       url: "/",
//       order: newOrder,
//     });
//     handleInputChange(settingKey, currentMenu);
//   };

//   const handleRemoveMenuItem = (settingKey: string, index: number) => {
//     const currentMenu = [...(editedValues[settingKey] || [])];
//     currentMenu.splice(index, 1);
//     // Reorder remaining items
//     currentMenu.forEach((item, idx) => {
//       item.order = idx + 1;
//     });
//     handleInputChange(settingKey, currentMenu);
//   };

//   const renderMenuEditor = (setting: Setting) => {
//     const menuItems = editedValues[setting.key] || [];

//     return (
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <p className="text-sm text-gray-600">
//             Configure navigation menu items
//           </p>
//           <Button
//             type="button"
//             size="sm"
//             onClick={() => handleAddMenuItem(setting.key)}
//             className="bg-green-500 hover:bg-green-600"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Item
//           </Button>
//         </div>

//         <div className="space-y-3">
//           {menuItems.map((item: MenuItem, index: number) => (
//             <Card
//               key={index}
//               className="border-2 border-gray-200 hover:border-green-300 transition-colors"
//             >
//               <CardContent className="p-4">
//                 <div className="flex gap-3 items-start">
//                   <div className="flex items-center justify-center mt-7">
//                     <GripVertical className="h-5 w-5 text-gray-400" />
//                   </div>

//                   <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {/* Order */}
//                     <div>
//                       <Label className="text-xs text-gray-600">Order</Label>
//                       <Input
//                         type="number"
//                         value={item.order}
//                         onChange={(e) =>
//                           handleMenuItemChange(
//                             setting.key,
//                             index,
//                             "order",
//                             parseInt(e.target.value)
//                           )
//                         }
//                         className="focus:ring-2 focus:ring-green-500"
//                         min="1"
//                       />
//                     </div>

//                     {/* Label */}
//                     <div>
//                       <Label className="text-xs text-gray-600">Label</Label>
//                       <Input
//                         type="text"
//                         value={item.label}
//                         onChange={(e) =>
//                           handleMenuItemChange(
//                             setting.key,
//                             index,
//                             "label",
//                             e.target.value
//                           )
//                         }
//                         className="focus:ring-2 focus:ring-green-500"
//                         placeholder="Menu label"
//                       />
//                     </div>

//                     {/* URL */}
//                     <div>
//                       <Label className="text-xs text-gray-600">URL</Label>
//                       <Input
//                         type="text"
//                         value={item.url}
//                         onChange={(e) =>
//                           handleMenuItemChange(
//                             setting.key,
//                             index,
//                             "url",
//                             e.target.value
//                           )
//                         }
//                         className="focus:ring-2 focus:ring-green-500"
//                         placeholder="/path"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-center mt-7">
//                     <Button
//                       type="button"
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => handleRemoveMenuItem(setting.key, index)}
//                       className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}

//           {menuItems.length === 0 && (
//             <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
//               <p className="text-gray-500 mb-3">No menu items yet</p>
//               <Button
//                 type="button"
//                 size="sm"
//                 onClick={() => handleAddMenuItem(setting.key)}
//                 className="bg-green-500 hover:bg-green-600"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add First Item
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderSettingInput = (setting: Setting) => {
//     const value = editedValues[setting.key] || "";

//     // Special handling for header_menu
//     if (setting.key === "header_menu") {
//       return renderMenuEditor(setting);
//     }

//     switch (setting.type) {
//       case "textarea":
//         return (
//           <Textarea
//             id={setting.key}
//             value={value}
//             onChange={(e) => handleInputChange(setting.key, e.target.value)}
//             placeholder={setting.description}
//             rows={4}
//             className="focus:ring-2 focus:ring-green-500"
//           />
//         );

//       case "boolean":
//         return (
//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id={setting.key}
//               checked={value === true || value === "true"}
//               onChange={(e) =>
//                 handleInputChange(setting.key, e.target.checked)
//               }
//               className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//             />
//             <Label htmlFor={setting.key} className="text-sm text-gray-600">
//               Enable {setting.description}
//             </Label>
//           </div>
//         );

//       case "image":
//         return (
//           <div className="space-y-2">
//             <Input
//               id={setting.key}
//               type="file"
//               accept="image/*"
//               className="focus:ring-2 focus:ring-green-500"
//             />
//             {value && (
//               <div className="mt-2">
//                 <img
//                   src={value}
//                   alt={setting.description}
//                   className="h-20 w-20 object-cover rounded border"
//                 />
//               </div>
//             )}
//           </div>
//         );

//       case "json":
//         return (
//           <Textarea
//             id={setting.key}
//             value={typeof value === "string" ? value : JSON.stringify(value, null, 2)}
//             onChange={(e) => handleInputChange(setting.key, e.target.value)}
//             placeholder={setting.description}
//             rows={8}
//             className="font-mono text-sm focus:ring-2 focus:ring-green-500"
//           />
//         );

//       default:
//         return (
//           <Input
//             id={setting.key}
//             type="text"
//             value={value}
//             onChange={(e) => handleInputChange(setting.key, e.target.value)}
//             placeholder={setting.description}
//             className="focus:ring-2 focus:ring-green-500"
//           />
//         );
//     }
//   };

//   const renderSettingsGroup = (settings: Setting[]) => {
//     return (
//       <div className="space-y-6">
//         {settings.map((setting) => (
//           <div key={setting.id} className="space-y-2">
//             <Label htmlFor={setting.key} className="text-sm font-semibold">
//               {setting.description}
//               {setting.type === "json" && setting.key !== "header_menu" && (
//                 <Badge variant="outline" className="ml-2 text-xs">
//                   JSON
//                 </Badge>
//               )}
//               {setting.type === "image" && (
//                 <Badge variant="outline" className="ml-2 text-xs">
//                   Image
//                 </Badge>
//               )}
//             </Label>
//             {renderSettingInput(setting)}
//             <p className="text-xs text-gray-500">Key: {setting.key}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//         <div className="space-y-6 p-6">
//           <div className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
//           <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//         <div className="flex items-center justify-center h-96">
//           <div className="text-center">
//             <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
//             <p className="text-xl font-semibold text-gray-600">
//               No settings available
//             </p>
//             <Button
//               onClick={() => navigate(-1)}
//               variant="outline"
//               className="mt-4"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Go Back
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <div className="space-y-6 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate(-1)}
//               className="hover:bg-slate-100 dark:hover:bg-slate-800"
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <div>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
//                   <Settings className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
//                     CMS Settings
//                   </h1>
//                   <p className="text-muted-foreground">
//                     Manage your website configuration and content
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Button
//             onClick={handleSave}
//             disabled={saving}
//             className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
//           >
//             <Save className="h-4 w-4 mr-2" />
//             {saving ? "Saving..." : "Save Changes"}
//           </Button>
//         </div>

//         {/* Settings Tabs */}
//         <Card className="border-2 border-green-100 dark:border-green-900">
//           <CardContent className="p-6">
//             <Tabs defaultValue="general" className="w-full">
//               <TabsList className="grid w-full grid-cols-5 mb-8">
//                 <TabsTrigger
//                   value="general"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Globe className="h-4 w-4 mr-2" />
//                   General
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="header"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Layout className="h-4 w-4 mr-2" />
//                   Header
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="footer"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Layers className="h-4 w-4 mr-2" />
//                   Footer
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="social"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Share2 className="h-4 w-4 mr-2" />
//                   Social
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="contact"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Phone className="h-4 w-4 mr-2" />
//                   Contact
//                 </TabsTrigger>
//               </TabsList>

//               {/* General Settings */}
//               <TabsContent value="general">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Globe className="h-5 w-5 text-green-600" />
//                       General Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Basic website information and branding
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.general)}</CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Header Settings */}
//               <TabsContent value="header">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Layout className="h-5 w-5 text-green-600" />
//                       Header Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Configure header style and navigation menu
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.header)}</CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Footer Settings */}
//               <TabsContent value="footer">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Layers className="h-5 w-5 text-green-600" />
//                       Footer Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Footer content and navigation links
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.footer)}</CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Social Media Settings */}
//               <TabsContent value="social">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Share2 className="h-5 w-5 text-green-600" />
//                       Social Media Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Social media profile links
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.social)}</CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Contact Settings */}
//               <TabsContent value="contact">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Phone className="h-5 w-5 text-green-600" />
//                       Contact Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Contact information and addresses
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.contact)}</CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default GetAllSettings;






















// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import {
//   Settings,
//   Globe,
//   Layout,
//   Layers,
//   Share2,
//   Phone,
//   Save,
//   ArrowLeft,
//   Plus,
//   Trash2,
//   GripVertical,
//   FolderPlus,
// } from "lucide-react";
// import makeApiRequest from "@/services/axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// // Types
// interface Setting {
//   id: number;
//   key: string;
//   value: any;
//   type: string;
//   group: string;
//   description: string;
//   created_at: string;
//   updated_at: string;
// }

// interface MenuItem {
//   label: string;
//   url: string;
//   order: number;
// }

// interface FooterLink {
//   label: string;
//   url: string;
// }

// interface FooterLinks {
//   [category: string]: FooterLink[];
// }

// interface SettingsData {
//   general: Setting[];
//   header: Setting[];
//   footer: Setting[];
//   social: Setting[];
//   contact: Setting[];
// }

// interface SettingsResponse {
//   success: boolean;
//   data: SettingsData;
// }

// const GetAllSettings = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState<SettingsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [editedValues, setEditedValues] = useState<Record<string, any>>({});

//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       const response: SettingsResponse = await makeApiRequest(
//         "admin/cms/settings",
//         {
//           method: "GET",
//         }
//       );

//       console.log("Settings Response:", response);

//       if (response?.success && response?.data) {
//         setData(response.data);

//         // Initialize edited values with current values
//         const initialValues: Record<string, any> = {};
//         Object.values(response.data)
//           .flat()
//           .forEach((setting) => {
//             initialValues[setting.key] = setting.value || "";
//           });
//         setEditedValues(initialValues);
//       }
//     } catch (error) {
//       console.error("Error fetching settings:", error);
//       toast.error("Failed to load settings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const handleInputChange = (key: string, value: any) => {
//     setEditedValues((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       // Here you would call your update API
//       // await makeApiRequest("admin/cms/settings", {
//       //   method: "PUT",
//       //   data: editedValues,
//       // });

//       toast.success("Settings updated successfully");
//       await fetchSettings();
//     } catch (error) {
//       console.error("Error saving settings:", error);
//       toast.error("Failed to save settings");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Header Menu Item Handlers
//   const handleMenuItemChange = (
//     settingKey: string,
//     index: number,
//     field: keyof MenuItem,
//     value: string | number
//   ) => {
//     const currentMenu = [...(editedValues[settingKey] || [])];
//     currentMenu[index] = {
//       ...currentMenu[index],
//       [field]: value,
//     };
//     handleInputChange(settingKey, currentMenu);
//   };

//   const handleAddMenuItem = (settingKey: string) => {
//     const currentMenu = [...(editedValues[settingKey] || [])];
//     const newOrder = currentMenu.length + 1;
//     currentMenu.push({
//       label: "New Menu Item",
//       url: "/",
//       order: newOrder,
//     });
//     handleInputChange(settingKey, currentMenu);
//   };

//   const handleRemoveMenuItem = (settingKey: string, index: number) => {
//     const currentMenu = [...(editedValues[settingKey] || [])];
//     currentMenu.splice(index, 1);
//     // Reorder remaining items
//     currentMenu.forEach((item, idx) => {
//       item.order = idx + 1;
//     });
//     handleInputChange(settingKey, currentMenu);
//   };

//   // Footer Links Handlers
//   const handleAddCategory = (settingKey: string) => {
//     const currentLinks = { ...(editedValues[settingKey] || {}) };
//     const categoryName = `New Category`;
//     currentLinks[categoryName] = [];
//     handleInputChange(settingKey, currentLinks);
//   };

//   const handleRemoveCategory = (settingKey: string, category: string) => {
//     const currentLinks = { ...(editedValues[settingKey] || {}) };
//     delete currentLinks[category];
//     handleInputChange(settingKey, currentLinks);
//   };

//   const handleRenameCategoryPrompt = (settingKey: string, oldCategory: string) => {
//     const newCategory = prompt("Enter new category name:", oldCategory);
//     if (newCategory && newCategory !== oldCategory) {
//       const currentLinks = { ...(editedValues[settingKey] || {}) };
//       currentLinks[newCategory] = currentLinks[oldCategory];
//       delete currentLinks[oldCategory];
//       handleInputChange(settingKey, currentLinks);
//     }
//   };

//   const handleFooterLinkChange = (
//     settingKey: string,
//     category: string,
//     index: number,
//     field: keyof FooterLink,
//     value: string
//   ) => {
//     const currentLinks = { ...(editedValues[settingKey] || {}) };
//     currentLinks[category][index] = {
//       ...currentLinks[category][index],
//       [field]: value,
//     };
//     handleInputChange(settingKey, currentLinks);
//   };

//   const handleAddFooterLink = (settingKey: string, category: string) => {
//     const currentLinks = { ...(editedValues[settingKey] || {}) };
//     if (!currentLinks[category]) {
//       currentLinks[category] = [];
//     }
//     currentLinks[category].push({
//       label: "New Link",
//       url: "/",
//     });
//     handleInputChange(settingKey, currentLinks);
//   };

//   const handleRemoveFooterLink = (
//     settingKey: string,
//     category: string,
//     index: number
//   ) => {
//     const currentLinks = { ...(editedValues[settingKey] || {}) };
//     currentLinks[category].splice(index, 1);
//     handleInputChange(settingKey, currentLinks);
//   };

//   const renderMenuEditor = (setting: Setting) => {
//     const menuItems = editedValues[setting.key] || [];

//     return (
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <p className="text-sm text-gray-600">
//             Configure navigation menu items
//           </p>
//           <Button
//             type="button"
//             size="sm"
//             onClick={() => handleAddMenuItem(setting.key)}
//             className="bg-green-500 hover:bg-green-600"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Item
//           </Button>
//         </div>

//         <div className="space-y-3">
//           {menuItems.map((item: MenuItem, index: number) => (
//             <Card
//               key={index}
//               className="border-2 border-gray-200 hover:border-green-300 transition-colors"
//             >
//               <CardContent className="p-4">
//                 <div className="flex gap-3 items-start">
//                   <div className="flex items-center justify-center mt-7">
//                     <GripVertical className="h-5 w-5 text-gray-400" />
//                   </div>

//                   <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {/* Order */}
//                     <div>
//                       <Label className="text-xs text-gray-600">Order</Label>
//                       <Input
//                         type="number"
//                         value={item.order}
//                         onChange={(e) =>
//                           handleMenuItemChange(
//                             setting.key,
//                             index,
//                             "order",
//                             parseInt(e.target.value)
//                           )
//                         }
//                         className="focus:ring-2 focus:ring-green-500"
//                         min="1"
//                       />
//                     </div>

//                     {/* Label */}
//                     <div>
//                       <Label className="text-xs text-gray-600">Label</Label>
//                       <Input
//                         type="text"
//                         value={item.label}
//                         onChange={(e) =>
//                           handleMenuItemChange(
//                             setting.key,
//                             index,
//                             "label",
//                             e.target.value
//                           )
//                         }
//                         className="focus:ring-2 focus:ring-green-500"
//                         placeholder="Menu label"
//                       />
//                     </div>

//                     {/* URL */}
//                     <div>
//                       <Label className="text-xs text-gray-600">URL</Label>
//                       <Input
//                         type="text"
//                         value={item.url}
//                         onChange={(e) =>
//                           handleMenuItemChange(
//                             setting.key,
//                             index,
//                             "url",
//                             e.target.value
//                           )
//                         }
//                         className="focus:ring-2 focus:ring-green-500"
//                         placeholder="/path"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-center mt-7">
//                     <Button
//                       type="button"
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => handleRemoveMenuItem(setting.key, index)}
//                       className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}

//           {menuItems.length === 0 && (
//             <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
//               <p className="text-gray-500 mb-3">No menu items yet</p>
//               <Button
//                 type="button"
//                 size="sm"
//                 onClick={() => handleAddMenuItem(setting.key)}
//                 className="bg-green-500 hover:bg-green-600"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add First Item
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderFooterLinksEditor = (setting: Setting) => {
//     const footerLinks: FooterLinks = editedValues[setting.key] || {};
//     const categories = Object.keys(footerLinks);

//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <p className="text-sm text-gray-600">
//             Configure footer navigation links by category
//           </p>
//           <Button
//             type="button"
//             size="sm"
//             onClick={() => handleAddCategory(setting.key)}
//             className="bg-green-500 hover:bg-green-600"
//           >
//             <FolderPlus className="h-4 w-4 mr-2" />
//             Add Category
//           </Button>
//         </div>

//         {categories.length === 0 && (
//           <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
//             <p className="text-gray-500 mb-3">No categories yet</p>
//             <Button
//               type="button"
//               size="sm"
//               onClick={() => handleAddCategory(setting.key)}
//               className="bg-green-500 hover:bg-green-600"
//             >
//               <FolderPlus className="h-4 w-4 mr-2" />
//               Add First Category
//             </Button>
//           </div>
//         )}

//         {categories.map((category) => (
//           <Card
//             key={category}
//             className="border-2 border-green-200 bg-green-50/30"
//           >
//             <CardHeader className="pb-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <Badge className="bg-green-600">Category</Badge>
//                   <CardTitle
//                     className="text-lg cursor-pointer hover:text-green-600"
//                     onClick={() => handleRenameCategoryPrompt(setting.key, category)}
//                   >
//                     {category}
//                   </CardTitle>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     type="button"
//                     size="sm"
//                     onClick={() => handleAddFooterLink(setting.key, category)}
//                     className="bg-green-500 hover:bg-green-600"
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Link
//                   </Button>
//                   <Button
//                     type="button"
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => handleRemoveCategory(setting.key, category)}
//                     className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {footerLinks[category].map((link: FooterLink, index: number) => (
//                   <Card
//                     key={index}
//                     className="border-2 border-gray-200 hover:border-green-300 transition-colors bg-white"
//                   >
//                     <CardContent className="p-4">
//                       <div className="flex gap-3 items-start">
//                         <div className="flex items-center justify-center mt-7">
//                           <GripVertical className="h-5 w-5 text-gray-400" />
//                         </div>

//                         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
//                           {/* Label */}
//                           <div>
//                             <Label className="text-xs text-gray-600">
//                               Label
//                             </Label>
//                             <Input
//                               type="text"
//                               value={link.label}
//                               onChange={(e) =>
//                                 handleFooterLinkChange(
//                                   setting.key,
//                                   category,
//                                   index,
//                                   "label",
//                                   e.target.value
//                                 )
//                               }
//                               className="focus:ring-2 focus:ring-green-500"
//                               placeholder="Link label"
//                             />
//                           </div>

//                           {/* URL */}
//                           <div>
//                             <Label className="text-xs text-gray-600">URL</Label>
//                             <Input
//                               type="text"
//                               value={link.url}
//                               onChange={(e) =>
//                                 handleFooterLinkChange(
//                                   setting.key,
//                                   category,
//                                   index,
//                                   "url",
//                                   e.target.value
//                                 )
//                               }
//                               className="focus:ring-2 focus:ring-green-500"
//                               placeholder="/path"
//                             />
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-center mt-7">
//                           <Button
//                             type="button"
//                             size="icon"
//                             variant="ghost"
//                             onClick={() =>
//                               handleRemoveFooterLink(setting.key, category, index)
//                             }
//                             className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}

//                 {footerLinks[category].length === 0 && (
//                   <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
//                     <p className="text-gray-500 text-sm mb-2">
//                       No links in this category
//                     </p>
//                     <Button
//                       type="button"
//                       size="sm"
//                       onClick={() => handleAddFooterLink(setting.key, category)}
//                       className="bg-green-500 hover:bg-green-600"
//                     >
//                       <Plus className="h-4 w-4 mr-2" />
//                       Add Link
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     );
//   };

//   const renderSettingInput = (setting: Setting) => {
//     const value = editedValues[setting.key] || "";

//     // Special handling for header_menu
//     if (setting.key === "header_menu") {
//       return renderMenuEditor(setting);
//     }

//     // Special handling for footer_links
//     if (setting.key === "footer_links") {
//       return renderFooterLinksEditor(setting);
//     }

//     switch (setting.type) {
//       case "textarea":
//         return (
//           <Textarea
//             id={setting.key}
//             value={value}
//             onChange={(e) => handleInputChange(setting.key, e.target.value)}
//             placeholder={setting.description}
//             rows={4}
//             className="focus:ring-2 focus:ring-green-500"
//           />
//         );

//       case "boolean":
//         return (
//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id={setting.key}
//               checked={value === true || value === "true"}
//               onChange={(e) =>
//                 handleInputChange(setting.key, e.target.checked)
//               }
//               className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//             />
//             <Label htmlFor={setting.key} className="text-sm text-gray-600">
//               Enable {setting.description}
//             </Label>
//           </div>
//         );

//       case "image":
//         return (
//           <div className="space-y-2">
//             <Input
//               id={setting.key}
//               type="file"
//               accept="image/*"
//               className="focus:ring-2 focus:ring-green-500"
//             />
//             {value && (
//               <div className="mt-2">
//                 <img
//                   src={value}
//                   alt={setting.description}
//                   className="h-20 w-20 object-cover rounded border"
//                 />
//               </div>
//             )}
//           </div>
//         );

//       case "json":
//         return (
//           <Textarea
//             id={setting.key}
//             value={
//               typeof value === "string" ? value : JSON.stringify(value, null, 2)
//             }
//             onChange={(e) => handleInputChange(setting.key, e.target.value)}
//             placeholder={setting.description}
//             rows={8}
//             className="font-mono text-sm focus:ring-2 focus:ring-green-500"
//           />
//         );

//       default:
//         return (
//           <Input
//             id={setting.key}
//             type="text"
//             value={value}
//             onChange={(e) => handleInputChange(setting.key, e.target.value)}
//             placeholder={setting.description}
//             className="focus:ring-2 focus:ring-green-500"
//           />
//         );
//     }
//   };

//   const renderSettingsGroup = (settings: Setting[]) => {
//     return (
//       <div className="space-y-6">
//         {settings.map((setting) => (
//           <div key={setting.id} className="space-y-2">
//             <Label htmlFor={setting.key} className="text-sm font-semibold">
//               {setting.description}
//               {setting.type === "json" &&
//                 setting.key !== "header_menu" &&
//                 setting.key !== "footer_links" && (
//                   <Badge variant="outline" className="ml-2 text-xs">
//                     JSON
//                   </Badge>
//                 )}
//               {setting.type === "image" && (
//                 <Badge variant="outline" className="ml-2 text-xs">
//                   Image
//                 </Badge>
//               )}
//             </Label>
//             {renderSettingInput(setting)}
//             <p className="text-xs text-gray-500">Key: {setting.key}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//         <div className="space-y-6 p-6">
//           <div className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
//           <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//         <div className="flex items-center justify-center h-96">
//           <div className="text-center">
//             <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
//             <p className="text-xl font-semibold text-gray-600">
//               No settings available
//             </p>
//             <Button
//               onClick={() => navigate(-1)}
//               variant="outline"
//               className="mt-4"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Go Back
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <div className="space-y-6 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate(-1)}
//               className="hover:bg-slate-100 dark:hover:bg-slate-800"
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <div>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
//                   <Settings className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
//                     CMS Settings
//                   </h1>
//                   <p className="text-muted-foreground">
//                     Manage your website configuration and content
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Button
//             onClick={handleSave}
//             disabled={saving}
//             className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
//           >
//             <Save className="h-4 w-4 mr-2" />
//             {saving ? "Saving..." : "Save Changes"}
//           </Button>
//         </div>

//         {/* Settings Tabs */}
//         <Card className="border-2 border-green-100 dark:border-green-900">
//           <CardContent className="p-6">
//             <Tabs defaultValue="general" className="w-full">
//               <TabsList className="grid w-full grid-cols-5 mb-8">
//                 <TabsTrigger
//                   value="general"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Globe className="h-4 w-4 mr-2" />
//                   General
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="header"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Layout className="h-4 w-4 mr-2" />
//                   Header
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="footer"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Layers className="h-4 w-4 mr-2" />
//                   Footer
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="social"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Share2 className="h-4 w-4 mr-2" />
//                   Social
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="contact"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Phone className="h-4 w-4 mr-2" />
//                   Contact
//                 </TabsTrigger>
//               </TabsList>

//               {/* General Settings */}
//               <TabsContent value="general">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Globe className="h-5 w-5 text-green-600" />
//                       General Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Basic website information and branding
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.general)}</CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Header Settings */}
//               <TabsContent value="header">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Layout className="h-5 w-5 text-green-600" />
//                       Header Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Configure header style and navigation menu
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.header)}</CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Footer Settings */}
//               <TabsContent value="footer">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Layers className="h-5 w-5 text-green-600" />
//                       Footer Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Footer content and navigation links
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.footer)}</CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Social Media Settings */}
//               <TabsContent value="social">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Share2 className="h-5 w-5 text-green-600" />
//                       Social Media Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Social media profile links
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.social)}</CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Contact Settings */}
//               <TabsContent value="contact">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Phone className="h-5 w-5 text-green-600" />
//                       Contact Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Contact information and addresses
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.contact)}</CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default GetAllSettings;





// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import {
//   Settings,
//   Globe,
//   Layout,
//   Layers,
//   Share2,
//   Phone,
//   Save,
//   ArrowLeft,
//   Plus,
//   Trash2,
//   GripVertical,
//   FolderPlus,
// } from "lucide-react";
// import makeApiRequest from "@/services/axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// // Types
// interface Setting {
//   id: number;
//   key: string;
//   value: any;
//   type: string;
//   group: string;
//   description: string;
//   created_at: string;
//   updated_at: string;
// }

// interface MenuItem {
//   label: string;
//   url: string;
//   order: number;
// }

// interface FooterLink {
//   label: string;
//   url: string;
// }

// interface FooterLinks {
//   [category: string]: FooterLink[];
// }

// interface SettingsData {
//   general: Setting[];
//   header: Setting[];
//   footer: Setting[];
//   social: Setting[];
//   contact: Setting[];
// }

// interface SettingsResponse {
//   success: boolean;
//   data: SettingsData;
// }

// const GetAllSettings = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState<SettingsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [editedValues, setEditedValues] = useState<Record<string, any>>({});
//   const [activeTab, setActiveTab] = useState("general");

//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       const response: SettingsResponse = await makeApiRequest(
//         "admin/cms/settings",
//         {
//           method: "GET",
//         }
//       );

//       console.log("Settings Response:", response);

//       if (response?.success && response?.data) {
//         setData(response.data);

//         // Initialize edited values with current values
//         const initialValues: Record<string, any> = {};
//         Object.values(response.data)
//           .flat()
//           .forEach((setting) => {
//             initialValues[setting.key] = setting.value || "";
//           });
//         setEditedValues(initialValues);
//       }
//     } catch (error) {
//       console.error("Error fetching settings:", error);
//       toast.error("Failed to load settings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const handleInputChange = (key: string, value: any) => {
//     setEditedValues((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleSaveGeneral = async () => {
//     try {
//       setSaving(true);

//       if (!data) return;

//       // Prepare settings array for general, social, and contact tabs
//       const settingsToUpdate = [
//         ...data.general,
//         ...data.social,
//         ...data.contact,
//       ]
//         .filter((setting) => setting.key !== "header_menu" && setting.key !== "footer_links")
//         .map((setting) => ({
//           key: setting.key,
//           value: editedValues[setting.key],
//           type: setting.type,
//         }));

//       await makeApiRequest("admin/cms/settings", {
//         method: "POST",
//         data: {
//           settings: settingsToUpdate,
//         },
//       });

//       toast.success("Settings updated successfully");
//       await fetchSettings();
//     } catch (error) {
//       console.error("Error saving settings:", error);
//       toast.error("Failed to save settings");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSaveHeader = async () => {
//     try {
//       setSaving(true);

//       // Save header menu
//       const headerMenu = editedValues["header_menu"] || [];
//       await makeApiRequest("admin/cms/header/menu", {
//         method: "PUT",
//         data: {
//           menu: headerMenu,
//         },
//       });

//       // Save other header settings (like header_style, show_announcement_bar)
//       if (data) {
//         const otherHeaderSettings = data.header
//           .filter((setting) => setting.key !== "header_menu")
//           .map((setting) => ({
//             key: setting.key,
//             value: editedValues[setting.key],
//             type: setting.type,
//           }));

//         if (otherHeaderSettings.length > 0) {
//           await makeApiRequest("admin/cms/settings", {
//             method: "POST",
//             data: {
//               settings: otherHeaderSettings,
//             },
//           });
//         }
//       }

//       toast.success("Header settings updated successfully");
//       await fetchSettings();
//     } catch (error) {
//       console.error("Error saving header settings:", error);
//       toast.error("Failed to save header settings");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSaveFooter = async () => {
//     try {
//       setSaving(true);

//       // Save footer links
//       const footerLinks = editedValues["footer_links"] || {};
//       await makeApiRequest("admin/cms/footer/links", {
//         method: "PUT",
//         data: {
//           links: footerLinks,
//         },
//       });

//       // Save other footer settings (like footer_about, footer_copyright)
//       if (data) {
//         const otherFooterSettings = data.footer
//           .filter((setting) => setting.key !== "footer_links")
//           .map((setting) => ({
//             key: setting.key,
//             value: editedValues[setting.key],
//             type: setting.type,
//           }));

//         if (otherFooterSettings.length > 0) {
//           await makeApiRequest("admin/cms/settings", {
//             method: "POST",
//             data: {
//               settings: otherFooterSettings,
//             },
//           });
//         }
//       }

//       toast.success("Footer settings updated successfully");
//       await fetchSettings();
//     } catch (error) {
//       console.error("Error saving footer settings:", error);
//       toast.error("Failed to save footer settings");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSave = async () => {
//     // Determine which save function to call based on active tab
//     switch (activeTab) {
//       case "general":
//       case "social":
//       case "contact":
//         await handleSaveGeneral();
//         break;
//       case "header":
//         await handleSaveHeader();
//         break;
//       case "footer":
//         await handleSaveFooter();
//         break;
//       default:
//         toast.error("Unknown tab");
//     }
//   };

//   // Header Menu Item Handlers
//   const handleMenuItemChange = (
//     settingKey: string,
//     index: number,
//     field: keyof MenuItem,
//     value: string | number
//   ) => {
//     const currentMenu = [...(editedValues[settingKey] || [])];
//     currentMenu[index] = {
//       ...currentMenu[index],
//       [field]: value,
//     };
//     handleInputChange(settingKey, currentMenu);
//   };

//   const handleAddMenuItem = (settingKey: string) => {
//     const currentMenu = [...(editedValues[settingKey] || [])];
//     const newOrder = currentMenu.length + 1;
//     currentMenu.push({
//       label: "New Menu Item",
//       url: "/",
//       order: newOrder,
//     });
//     handleInputChange(settingKey, currentMenu);
//   };

//   const handleRemoveMenuItem = (settingKey: string, index: number) => {
//     const currentMenu = [...(editedValues[settingKey] || [])];
//     currentMenu.splice(index, 1);
//     // Reorder remaining items
//     currentMenu.forEach((item, idx) => {
//       item.order = idx + 1;
//     });
//     handleInputChange(settingKey, currentMenu);
//   };

//   // Footer Links Handlers
//   const handleAddCategory = (settingKey: string) => {
//     const currentLinks = { ...(editedValues[settingKey] || {}) };
//     const categoryName = `New Category`;
//     currentLinks[categoryName] = [];
//     handleInputChange(settingKey, currentLinks);
//   };

//   const handleRemoveCategory = (settingKey: string, category: string) => {
//     const currentLinks = { ...(editedValues[settingKey] || {}) };
//     delete currentLinks[category];
//     handleInputChange(settingKey, currentLinks);
//   };

//   const handleRenameCategoryPrompt = (
//     settingKey: string,
//     oldCategory: string
//   ) => {
//     const newCategory = prompt("Enter new category name:", oldCategory);
//     if (newCategory && newCategory !== oldCategory) {
//       const currentLinks = { ...(editedValues[settingKey] || {}) };
//       currentLinks[newCategory] = currentLinks[oldCategory];
//       delete currentLinks[oldCategory];
//       handleInputChange(settingKey, currentLinks);
//     }
//   };

//   const handleFooterLinkChange = (
//     settingKey: string,
//     category: string,
//     index: number,
//     field: keyof FooterLink,
//     value: string
//   ) => {
//     const currentLinks = { ...(editedValues[settingKey] || {}) };
//     currentLinks[category][index] = {
//       ...currentLinks[category][index],
//       [field]: value,
//     };
//     handleInputChange(settingKey, currentLinks);
//   };

//   const handleAddFooterLink = (settingKey: string, category: string) => {
//     const currentLinks = { ...(editedValues[settingKey] || {}) };
//     if (!currentLinks[category]) {
//       currentLinks[category] = [];
//     }
//     currentLinks[category].push({
//       label: "New Link",
//       url: "/",
//     });
//     handleInputChange(settingKey, currentLinks);
//   };

//   const handleRemoveFooterLink = (
//     settingKey: string,
//     category: string,
//     index: number
//   ) => {
//     const currentLinks = { ...(editedValues[settingKey] || {}) };
//     currentLinks[category].splice(index, 1);
//     handleInputChange(settingKey, currentLinks);
//   };

//   const renderMenuEditor = (setting: Setting) => {
//     const menuItems = editedValues[setting.key] || [];

//     return (
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <p className="text-sm text-gray-600">
//             Configure navigation menu items
//           </p>
//           <Button
//             type="button"
//             size="sm"
//             onClick={() => handleAddMenuItem(setting.key)}
//             className="bg-green-500 hover:bg-green-600"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Item
//           </Button>
//         </div>

//         <div className="space-y-3">
//           {menuItems.map((item: MenuItem, index: number) => (
//             <Card
//               key={index}
//               className="border-2 border-gray-200 hover:border-green-300 transition-colors"
//             >
//               <CardContent className="p-4">
//                 <div className="flex gap-3 items-start">
//                   <div className="flex items-center justify-center mt-7">
//                     <GripVertical className="h-5 w-5 text-gray-400" />
//                   </div>

//                   <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {/* Order */}
//                     <div>
//                       <Label className="text-xs text-gray-600">Order</Label>
//                       <Input
//                         type="number"
//                         value={item.order}
//                         onChange={(e) =>
//                           handleMenuItemChange(
//                             setting.key,
//                             index,
//                             "order",
//                             parseInt(e.target.value)
//                           )
//                         }
//                         className="focus:ring-2 focus:ring-green-500"
//                         min="1"
//                       />
//                     </div>

//                     {/* Label */}
//                     <div>
//                       <Label className="text-xs text-gray-600">Label</Label>
//                       <Input
//                         type="text"
//                         value={item.label}
//                         onChange={(e) =>
//                           handleMenuItemChange(
//                             setting.key,
//                             index,
//                             "label",
//                             e.target.value
//                           )
//                         }
//                         className="focus:ring-2 focus:ring-green-500"
//                         placeholder="Menu label"
//                       />
//                     </div>

//                     {/* URL */}
//                     <div>
//                       <Label className="text-xs text-gray-600">URL</Label>
//                       <Input
//                         type="text"
//                         value={item.url}
//                         onChange={(e) =>
//                           handleMenuItemChange(
//                             setting.key,
//                             index,
//                             "url",
//                             e.target.value
//                           )
//                         }
//                         className="focus:ring-2 focus:ring-green-500"
//                         placeholder="/path"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-center mt-7">
//                     <Button
//                       type="button"
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => handleRemoveMenuItem(setting.key, index)}
//                       className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}

//           {menuItems.length === 0 && (
//             <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
//               <p className="text-gray-500 mb-3">No menu items yet</p>
//               <Button
//                 type="button"
//                 size="sm"
//                 onClick={() => handleAddMenuItem(setting.key)}
//                 className="bg-green-500 hover:bg-green-600"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add First Item
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderFooterLinksEditor = (setting: Setting) => {
//     const footerLinks: FooterLinks = editedValues[setting.key] || {};
//     const categories = Object.keys(footerLinks);

//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <p className="text-sm text-gray-600">
//             Configure footer navigation links by category
//           </p>
//           <Button
//             type="button"
//             size="sm"
//             onClick={() => handleAddCategory(setting.key)}
//             className="bg-green-500 hover:bg-green-600"
//           >
//             <FolderPlus className="h-4 w-4 mr-2" />
//             Add Category
//           </Button>
//         </div>

//         {categories.length === 0 && (
//           <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
//             <p className="text-gray-500 mb-3">No categories yet</p>
//             <Button
//               type="button"
//               size="sm"
//               onClick={() => handleAddCategory(setting.key)}
//               className="bg-green-500 hover:bg-green-600"
//             >
//               <FolderPlus className="h-4 w-4 mr-2" />
//               Add First Category
//             </Button>
//           </div>
//         )}

//         {categories.map((category) => (
//           <Card
//             key={category}
//             className="border-2 border-green-200 bg-green-50/30"
//           >
//             <CardHeader className="pb-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <Badge className="bg-green-600">Category</Badge>
//                   <CardTitle
//                     className="text-lg cursor-pointer hover:text-green-600"
//                     onClick={() =>
//                       handleRenameCategoryPrompt(setting.key, category)
//                     }
//                   >
//                     {category}
//                   </CardTitle>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button
//                     type="button"
//                     size="sm"
//                     onClick={() => handleAddFooterLink(setting.key, category)}
//                     className="bg-green-500 hover:bg-green-600"
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Link
//                   </Button>
//                   <Button
//                     type="button"
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => handleRemoveCategory(setting.key, category)}
//                     className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {footerLinks[category].map((link: FooterLink, index: number) => (
//                   <Card
//                     key={index}
//                     className="border-2 border-gray-200 hover:border-green-300 transition-colors bg-white"
//                   >
//                     <CardContent className="p-4">
//                       <div className="flex gap-3 items-start">
//                         <div className="flex items-center justify-center mt-7">
//                           <GripVertical className="h-5 w-5 text-gray-400" />
//                         </div>

//                         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
//                           {/* Label */}
//                           <div>
//                             <Label className="text-xs text-gray-600">
//                               Label
//                             </Label>
//                             <Input
//                               type="text"
//                               value={link.label}
//                               onChange={(e) =>
//                                 handleFooterLinkChange(
//                                   setting.key,
//                                   category,
//                                   index,
//                                   "label",
//                                   e.target.value
//                                 )
//                               }
//                               className="focus:ring-2 focus:ring-green-500"
//                               placeholder="Link label"
//                             />
//                           </div>

//                           {/* URL */}
//                           <div>
//                             <Label className="text-xs text-gray-600">URL</Label>
//                             <Input
//                               type="text"
//                               value={link.url}
//                               onChange={(e) =>
//                                 handleFooterLinkChange(
//                                   setting.key,
//                                   category,
//                                   index,
//                                   "url",
//                                   e.target.value
//                                 )
//                               }
//                               className="focus:ring-2 focus:ring-green-500"
//                               placeholder="/path"
//                             />
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-center mt-7">
//                           <Button
//                             type="button"
//                             size="icon"
//                             variant="ghost"
//                             onClick={() =>
//                               handleRemoveFooterLink(
//                                 setting.key,
//                                 category,
//                                 index
//                               )
//                             }
//                             className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}

//                 {footerLinks[category].length === 0 && (
//                   <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
//                     <p className="text-gray-500 text-sm mb-2">
//                       No links in this category
//                     </p>
//                     <Button
//                       type="button"
//                       size="sm"
//                       onClick={() =>
//                         handleAddFooterLink(setting.key, category)
//                       }
//                       className="bg-green-500 hover:bg-green-600"
//                     >
//                       <Plus className="h-4 w-4 mr-2" />
//                       Add Link
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     );
//   };

//   const renderSettingInput = (setting: Setting) => {
//     const value = editedValues[setting.key] || "";

//     // Special handling for header_menu
//     if (setting.key === "header_menu") {
//       return renderMenuEditor(setting);
//     }

//     // Special handling for footer_links
//     if (setting.key === "footer_links") {
//       return renderFooterLinksEditor(setting);
//     }

//     switch (setting.type) {
//       case "textarea":
//         return (
//           <Textarea
//             id={setting.key}
//             value={value}
//             onChange={(e) => handleInputChange(setting.key, e.target.value)}
//             placeholder={setting.description}
//             rows={4}
//             className="focus:ring-2 focus:ring-green-500"
//           />
//         );

//       case "boolean":
//         return (
//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id={setting.key}
//               checked={value === true || value === "true"}
//               onChange={(e) =>
//                 handleInputChange(setting.key, e.target.checked)
//               }
//               className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//             />
//             <Label htmlFor={setting.key} className="text-sm text-gray-600">
//               Enable {setting.description}
//             </Label>
//           </div>
//         );

//       case "image":
//         return (
//           <div className="space-y-2">
//             <Input
//               id={setting.key}
//               type="file"
//               accept="image/*"
//               className="focus:ring-2 focus:ring-green-500"
//             />
//             {value && (
//               <div className="mt-2">
//                 <img
//                   src={value}
//                   alt={setting.description}
//                   className="h-20 w-20 object-cover rounded border"
//                 />
//               </div>
//             )}
//           </div>
//         );

//       case "json":
//         return (
//           <Textarea
//             id={setting.key}
//             value={
//               typeof value === "string" ? value : JSON.stringify(value, null, 2)
//             }
//             onChange={(e) => handleInputChange(setting.key, e.target.value)}
//             placeholder={setting.description}
//             rows={8}
//             className="font-mono text-sm focus:ring-2 focus:ring-green-500"
//           />
//         );

//       default:
//         return (
//           <Input
//             id={setting.key}
//             type="text"
//             value={value}
//             onChange={(e) => handleInputChange(setting.key, e.target.value)}
//             placeholder={setting.description}
//             className="focus:ring-2 focus:ring-green-500"
//           />
//         );
//     }
//   };

//   const renderSettingsGroup = (settings: Setting[]) => {
//     return (
//       <div className="space-y-6">
//         {settings.map((setting) => (
//           <div key={setting.id} className="space-y-2">
//             <Label htmlFor={setting.key} className="text-sm font-semibold">
//               {setting.description}
//               {setting.type === "json" &&
//                 setting.key !== "header_menu" &&
//                 setting.key !== "footer_links" && (
//                   <Badge variant="outline" className="ml-2 text-xs">
//                     JSON
//                   </Badge>
//                 )}
//               {setting.type === "image" && (
//                 <Badge variant="outline" className="ml-2 text-xs">
//                   Image
//                 </Badge>
//               )}
//             </Label>
//             {renderSettingInput(setting)}
//             <p className="text-xs text-gray-500">Key: {setting.key}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//         <div className="space-y-6 p-6">
//           <div className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
//           <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//         <div className="flex items-center justify-center h-96">
//           <div className="text-center">
//             <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
//             <p className="text-xl font-semibold text-gray-600">
//               No settings available
//             </p>
//             <Button
//               onClick={() => navigate(-1)}
//               variant="outline"
//               className="mt-4"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Go Back
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//       <div className="space-y-6 p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate(-1)}
//               className="hover:bg-slate-100 dark:hover:bg-slate-800"
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back
//             </Button>
//             <div>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
//                   <Settings className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
//                     CMS Settings
//                   </h1>
//                   <p className="text-muted-foreground">
//                     Manage your website configuration and content
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Button
//             onClick={handleSave}
//             disabled={saving}
//             className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
//           >
//             <Save className="h-4 w-4 mr-2" />
//             {saving ? "Saving..." : "Save Changes"}
//           </Button>
//         </div>

//         {/* Settings Tabs */}
//         <Card className="border-2 border-green-100 dark:border-green-900">
//           <CardContent className="p-6">
//             <Tabs
//               defaultValue="general"
//               className="w-full"
//               onValueChange={setActiveTab}
//             >
//               <TabsList className="grid w-full grid-cols-5 mb-8">
//                 <TabsTrigger
//                   value="general"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Globe className="h-4 w-4 mr-2" />
//                   General
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="header"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Layout className="h-4 w-4 mr-2" />
//                   Header
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="footer"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Layers className="h-4 w-4 mr-2" />
//                   Footer
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="social"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Share2 className="h-4 w-4 mr-2" />
//                   Social
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="contact"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
//                 >
//                   <Phone className="h-4 w-4 mr-2" />
//                   Contact
//                 </TabsTrigger>
//               </TabsList>

//               {/* General Settings */}
//               <TabsContent value="general">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Globe className="h-5 w-5 text-green-600" />
//                       General Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Basic website information and branding
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.general)}</CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Header Settings */}
//               <TabsContent value="header">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Layout className="h-5 w-5 text-green-600" />
//                       Header Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Configure header style and navigation menu
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.header)}</CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Footer Settings */}
//               <TabsContent value="footer">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Layers className="h-5 w-5 text-green-600" />
//                       Footer Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Footer content and navigation links
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.footer)}</CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Social Media Settings */}
//               <TabsContent value="social">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Share2 className="h-5 w-5 text-green-600" />
//                       Social Media Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Social media profile links
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.social)}</CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Contact Settings */}
//               <TabsContent value="contact">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Phone className="h-5 w-5 text-green-600" />
//                       Contact Settings
//                     </CardTitle>
//                     <CardDescription>
//                       Contact information and addresses
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>{renderSettingsGroup(data.contact)}</CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default GetAllSettings;













import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Globe,
  Layout,
  Layers,
  Share2,
  Phone,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  FolderPlus,
} from "lucide-react";
import makeApiRequest from "@/services/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";

// Types
interface Setting {
  id: number;
  key: string;
  value: any;
  type: string;
  group: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface MenuItem {
  label: string;
  url: string;
  order: number;
}

interface FooterLink {
  label: string;
  url: string;
}

interface FooterLinks {
  [category: string]: FooterLink[];
}

interface SettingsData {
  general: Setting[];
  header: Setting[];
  footer: Setting[];
  social: Setting[];
  contact: Setting[];
}

interface SettingsResponse {
  success: boolean;
  data: SettingsData;
}

const GetAllSettings = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState("general");

  // Rename Category Modal State
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameData, setRenameData] = useState({
    settingKey: "",
    oldCategory: "",
    newCategory: "",
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response: SettingsResponse = await makeApiRequest(
        "admin/cms/settings",
        {
          method: "GET",
        }
      );

      console.log("Settings Response:", response);

      if (response?.success && response?.data) {
        setData(response.data);

        // Initialize edited values with current values
        const initialValues: Record<string, any> = {};
        Object.values(response.data)
          .flat()
          .forEach((setting) => {
            initialValues[setting.key] = setting.value || "";
          });
        setEditedValues(initialValues);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (key: string, value: any) => {
    setEditedValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveGeneral = async () => {
    try {
      setSaving(true);

      if (!data) return;

      // Prepare settings array for general, social, and contact tabs
      const settingsToUpdate = [
        ...data.general,
        ...data.social,
        ...data.contact,
      ]
        .filter(
          (setting) =>
            setting.key !== "header_menu" && setting.key !== "footer_links"
        )
        .map((setting) => ({
          key: setting.key,
          value: editedValues[setting.key],
          type: setting.type,
        }));

      await makeApiRequest("admin/cms/settings", {
        method: "POST",
        data: {
          settings: settingsToUpdate,
        },
      });

      toast.success("Settings updated successfully");
      await fetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHeader = async () => {
    try {
      setSaving(true);

      // Save header menu
      const headerMenu = editedValues["header_menu"] || [];
      await makeApiRequest("admin/cms/header/menu", {
        method: "PUT",
        data: {
          menu: headerMenu,
        },
      });

      // Save other header settings (like header_style, show_announcement_bar)
      if (data) {
        const otherHeaderSettings = data.header
          .filter((setting) => setting.key !== "header_menu")
          .map((setting) => ({
            key: setting.key,
            value: editedValues[setting.key],
            type: setting.type,
          }));

        if (otherHeaderSettings.length > 0) {
          await makeApiRequest("admin/cms/settings", {
            method: "POST",
            data: {
              settings: otherHeaderSettings,
            },
          });
        }
      }

      toast.success("Header settings updated successfully");
      await fetchSettings();
    } catch (error) {
      console.error("Error saving header settings:", error);
      toast.error("Failed to save header settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFooter = async () => {
    try {
      setSaving(true);

      // Save footer links
      const footerLinks = editedValues["footer_links"] || {};
      await makeApiRequest("admin/cms/footer/links", {
        method: "PUT",
        data: {
          links: footerLinks,
        },
      });

      // Save other footer settings (like footer_about, footer_copyright)
      if (data) {
        const otherFooterSettings = data.footer
          .filter((setting) => setting.key !== "footer_links")
          .map((setting) => ({
            key: setting.key,
            value: editedValues[setting.key],
            type: setting.type,
          }));

        if (otherFooterSettings.length > 0) {
          await makeApiRequest("admin/cms/settings", {
            method: "POST",
            data: {
              settings: otherFooterSettings,
            },
          });
        }
      }

      toast.success("Footer settings updated successfully");
      await fetchSettings();
    } catch (error) {
      console.error("Error saving footer settings:", error);
      toast.error("Failed to save footer settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    // Determine which save function to call based on active tab
    switch (activeTab) {
      case "general":
      case "social":
      case "contact":
        await handleSaveGeneral();
        break;
      case "header":
        await handleSaveHeader();
        break;
      case "footer":
        await handleSaveFooter();
        break;
      default:
        toast.error("Unknown tab");
    }
  };

  // Header Menu Item Handlers
  const handleMenuItemChange = (
    settingKey: string,
    index: number,
    field: keyof MenuItem,
    value: string | number
  ) => {
    const currentMenu = [...(editedValues[settingKey] || [])];
    currentMenu[index] = {
      ...currentMenu[index],
      [field]: value,
    };
    handleInputChange(settingKey, currentMenu);
  };

  const handleAddMenuItem = (settingKey: string) => {
    const currentMenu = [...(editedValues[settingKey] || [])];
    const newOrder = currentMenu.length + 1;
    currentMenu.push({
      label: "New Menu Item",
      url: "/",
      order: newOrder,
    });
    handleInputChange(settingKey, currentMenu);
  };

  const handleRemoveMenuItem = (settingKey: string, index: number) => {
    const currentMenu = [...(editedValues[settingKey] || [])];
    currentMenu.splice(index, 1);
    // Reorder remaining items
    currentMenu.forEach((item, idx) => {
      item.order = idx + 1;
    });
    handleInputChange(settingKey, currentMenu);
  };

  // Footer Links Handlers
  const handleAddCategory = (settingKey: string) => {
    const currentLinks = { ...(editedValues[settingKey] || {}) };
    const categoryName = `New Category`;
    currentLinks[categoryName] = [];
    handleInputChange(settingKey, currentLinks);
  };

  const handleRemoveCategory = (settingKey: string, category: string) => {
    const currentLinks = { ...(editedValues[settingKey] || {}) };
    delete currentLinks[category];
    handleInputChange(settingKey, currentLinks);
  };

  const handleOpenRenameModal = (settingKey: string, oldCategory: string) => {
    setRenameData({
      settingKey,
      oldCategory,
      newCategory: oldCategory,
    });
    setIsRenameModalOpen(true);
  };

  const handleCloseRenameModal = () => {
    setIsRenameModalOpen(false);
    setRenameData({
      settingKey: "",
      oldCategory: "",
      newCategory: "",
    });
  };

  const handleRenameCategory = () => {
    const { settingKey, oldCategory, newCategory } = renameData;

    if (newCategory && newCategory !== oldCategory) {
      const currentLinks = { ...(editedValues[settingKey] || {}) };
      currentLinks[newCategory] = currentLinks[oldCategory];
      delete currentLinks[oldCategory];
      handleInputChange(settingKey, currentLinks);
      toast.success("Category renamed successfully");
    }

    handleCloseRenameModal();
  };

  const handleFooterLinkChange = (
    settingKey: string,
    category: string,
    index: number,
    field: keyof FooterLink,
    value: string
  ) => {
    const currentLinks = { ...(editedValues[settingKey] || {}) };
    currentLinks[category][index] = {
      ...currentLinks[category][index],
      [field]: value,
    };
    handleInputChange(settingKey, currentLinks);
  };

  const handleAddFooterLink = (settingKey: string, category: string) => {
    const currentLinks = { ...(editedValues[settingKey] || {}) };
    if (!currentLinks[category]) {
      currentLinks[category] = [];
    }
    currentLinks[category].push({
      label: "New Link",
      url: "/",
    });
    handleInputChange(settingKey, currentLinks);
  };

  const handleRemoveFooterLink = (
    settingKey: string,
    category: string,
    index: number
  ) => {
    const currentLinks = { ...(editedValues[settingKey] || {}) };
    currentLinks[category].splice(index, 1);
    handleInputChange(settingKey, currentLinks);
  };

  const renderMenuEditor = (setting: Setting) => {
    const menuItems = editedValues[setting.key] || [];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Configure navigation menu items
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => handleAddMenuItem(setting.key)}
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {menuItems.map((item: MenuItem, index: number) => (
            <Card
              key={index}
              className="border-2 border-gray-200 hover:border-green-300 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex gap-3 items-start">
                  <div className="flex items-center justify-center mt-7">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Order */}
                    <div>
                      <Label className="text-xs text-gray-600">Order</Label>
                      <Input
                        type="number"
                        value={item.order}
                        onChange={(e) =>
                          handleMenuItemChange(
                            setting.key,
                            index,
                            "order",
                            parseInt(e.target.value)
                          )
                        }
                        className="focus:ring-2 focus:ring-green-500"
                        min="1"
                      />
                    </div>

                    {/* Label */}
                    <div>
                      <Label className="text-xs text-gray-600">Label</Label>
                      <Input
                        type="text"
                        value={item.label}
                        onChange={(e) =>
                          handleMenuItemChange(
                            setting.key,
                            index,
                            "label",
                            e.target.value
                          )
                        }
                        className="focus:ring-2 focus:ring-green-500"
                        placeholder="Menu label"
                      />
                    </div>

                    {/* URL */}
                    <div>
                      <Label className="text-xs text-gray-600">URL</Label>
                      <Input
                        type="text"
                        value={item.url}
                        onChange={(e) =>
                          handleMenuItemChange(
                            setting.key,
                            index,
                            "url",
                            e.target.value
                          )
                        }
                        className="focus:ring-2 focus:ring-green-500"
                        placeholder="/path"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center mt-7">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveMenuItem(setting.key, index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {menuItems.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-3">No menu items yet</p>
              <Button
                type="button"
                size="sm"
                onClick={() => handleAddMenuItem(setting.key)}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFooterLinksEditor = (setting: Setting) => {
    const footerLinks: FooterLinks = editedValues[setting.key] || {};
    const categories = Object.keys(footerLinks);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Configure footer navigation links by category
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => handleAddCategory(setting.key)}
            className="bg-green-500 hover:bg-green-600"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-3">No categories yet</p>
            <Button
              type="button"
              size="sm"
              onClick={() => handleAddCategory(setting.key)}
              className="bg-green-500 hover:bg-green-600"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Add First Category
            </Button>
          </div>
        )}

        {categories.map((category) => (
          <Card
            key={category}
            className="border-2 border-green-200 bg-green-50/30"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-600">Category</Badge>
                  <CardTitle
                    className="text-lg cursor-pointer hover:text-green-600"
                    onClick={() => handleOpenRenameModal(setting.key, category)}
                  >
                    {category}
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleAddFooterLink(setting.key, category)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveCategory(setting.key, category)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {footerLinks[category].map(
                  (link: FooterLink, index: number) => (
                    <Card
                      key={index}
                      className="border-2 border-gray-200 hover:border-green-300 transition-colors bg-white"
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-3 items-start">
                          <div className="flex items-center justify-center mt-7">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>

                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Label */}
                            <div>
                              <Label className="text-xs text-gray-600">
                                Label
                              </Label>
                              <Input
                                type="text"
                                value={link.label}
                                onChange={(e) =>
                                  handleFooterLinkChange(
                                    setting.key,
                                    category,
                                    index,
                                    "label",
                                    e.target.value
                                  )
                                }
                                className="focus:ring-2 focus:ring-green-500"
                                placeholder="Link label"
                              />
                            </div>

                            {/* URL */}
                            <div>
                              <Label className="text-xs text-gray-600">
                                URL
                              </Label>
                              <Input
                                type="text"
                                value={link.url}
                                onChange={(e) =>
                                  handleFooterLinkChange(
                                    setting.key,
                                    category,
                                    index,
                                    "url",
                                    e.target.value
                                  )
                                }
                                className="focus:ring-2 focus:ring-green-500"
                                placeholder="/path"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-center mt-7">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                handleRemoveFooterLink(
                                  setting.key,
                                  category,
                                  index
                                )
                              }
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}

                {footerLinks[category].length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                    <p className="text-gray-500 text-sm mb-2">
                      No links in this category
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddFooterLink(setting.key, category)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderSettingInput = (setting: Setting) => {
    const value = editedValues[setting.key] || "";

    // Special handling for header_menu
    if (setting.key === "header_menu") {
      return renderMenuEditor(setting);
    }

    // Special handling for footer_links
    if (setting.key === "footer_links") {
      return renderFooterLinksEditor(setting);
    }

    switch (setting.type) {
      case "textarea":
        return (
          <Textarea
            id={setting.key}
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            placeholder={setting.description}
            rows={4}
            className="focus:ring-2 focus:ring-green-500"
          />
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={setting.key}
              checked={value === true || value === "true"}
              onChange={(e) =>
                handleInputChange(setting.key, e.target.checked)
              }
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <Label htmlFor={setting.key} className="text-sm text-gray-600">
              Enable {setting.description}
            </Label>
          </div>
        );

      case "image":
        return (
          <div className="space-y-2">
            <Input
              id={setting.key}
              type="file"
              accept="image/*"
              className="focus:ring-2 focus:ring-green-500"
            />
            {value && (
              <div className="mt-2">
                <img
                  src={value}
                  alt={setting.description}
                  className="h-20 w-20 object-cover rounded border"
                />
              </div>
            )}
          </div>
        );

      case "json":
        return (
          <Textarea
            id={setting.key}
            value={
              typeof value === "string" ? value : JSON.stringify(value, null, 2)
            }
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            placeholder={setting.description}
            rows={8}
            className="font-mono text-sm focus:ring-2 focus:ring-green-500"
          />
        );

      default:
        return (
          <Input
            id={setting.key}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(setting.key, e.target.value)}
            placeholder={setting.description}
            className="focus:ring-2 focus:ring-green-500"
          />
        );
    }
  };

  const renderSettingsGroup = (settings: Setting[]) => {
    return (
      <div className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.id} className="space-y-2">
            <Label htmlFor={setting.key} className="text-sm font-semibold">
              {setting.description}
              {setting.type === "json" &&
                setting.key !== "header_menu" &&
                setting.key !== "footer_links" && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    JSON
                  </Badge>
                )}
              {setting.type === "image" && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Image
                </Badge>
              )}
            </Label>
            {renderSettingInput(setting)}
            <p className="text-xs text-gray-500">Key: {setting.key}</p>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="space-y-6 p-6">
          <div className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-600">
              No settings available
            </p>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                    CMS Settings
                  </h1>
                  <p className="text-muted-foreground">
                    Manage your website configuration and content
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Settings Tabs */}
        <Card className="border-2 border-green-100 dark:border-green-900">
          <CardContent className="p-6">
            <Tabs
              defaultValue="general"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="header"
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <Layout className="h-4 w-4 mr-2" />
                  Header
                </TabsTrigger>
                <TabsTrigger
                  value="footer"
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Footer
                </TabsTrigger>
                <TabsTrigger
                  value="social"
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Social
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-green-600" />
                      General Settings
                    </CardTitle>
                    <CardDescription>
                      Basic website information and branding
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{renderSettingsGroup(data.general)}</CardContent>
                </Card>
              </TabsContent>

              {/* Header Settings */}
              <TabsContent value="header">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="h-5 w-5 text-green-600" />
                      Header Settings
                    </CardTitle>
                    <CardDescription>
                      Configure header style and navigation menu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{renderSettingsGroup(data.header)}</CardContent>
                </Card>
              </TabsContent>

              {/* Footer Settings */}
              <TabsContent value="footer">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-green-600" />
                      Footer Settings
                    </CardTitle>
                    <CardDescription>
                      Footer content and navigation links
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{renderSettingsGroup(data.footer)}</CardContent>
                </Card>
              </TabsContent>

              {/* Social Media Settings */}
              <TabsContent value="social">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-green-600" />
                      Social Media Settings
                    </CardTitle>
                    <CardDescription>
                      Social media profile links
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{renderSettingsGroup(data.social)}</CardContent>
                </Card>
              </TabsContent>

              {/* Contact Settings */}
              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-green-600" />
                      Contact Settings
                    </CardTitle>
                    <CardDescription>
                      Contact information and addresses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{renderSettingsGroup(data.contact)}</CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Rename Category Modal */}
        <Modal
          isOpen={isRenameModalOpen}
          onClose={handleCloseRenameModal}
          title="Rename Category"
          showFooter={false}
          width="max-w-md"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name" className="text-sm font-semibold">
                Category Name
              </Label>
              <Input
                id="category-name"
                type="text"
                value={renameData.newCategory}
                onChange={(e) =>
                  setRenameData({ ...renameData, newCategory: e.target.value })
                }
                placeholder="Enter category name"
                className="mt-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleCloseRenameModal}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRenameCategory}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled={!renameData.newCategory.trim()}
              >
                Rename
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default GetAllSettings;