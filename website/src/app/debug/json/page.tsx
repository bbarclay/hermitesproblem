'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Braces, FileJson, RefreshCw } from 'lucide-react';

export default function JsonDebugPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Load file list
  useEffect(() => {
    // In a real implementation, this would fetch the list of JSON files
    // For now, we'll just use a hardcoded list
    const jsonFiles = [
      'toc',
      'abstract',
      'introduction',
      'matrix-approach',
      'equivalence',
      'hapd-algorithm',
      'subtractive-algorithm',
      'numerical-validation',
      'conclusion'
    ];
    
    setFiles(jsonFiles);
    setLoading(false);
  }, []);
  
  // Load file content when a file is selected
  useEffect(() => {
    if (!selectedFile) return;
    
    setLoading(true);
    
    fetch(`/content/${selectedFile}.json`)
      .then(res => res.json())
      .then(data => {
        setFileContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(`Error loading ${selectedFile}:`, err);
        setLoading(false);
      });
  }, [selectedFile]);
  
  // Format JSON for display
  const formatJson = (json: any) => {
    return JSON.stringify(json, null, 2);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">JSON Explorer</h1>
      <p className="text-gray-600 mb-8">
        Explore the JSON content files to understand their structure.
      </p>
      
      {loading && !selectedFile ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 border rounded-lg p-4 bg-white">
            <h2 className="text-xl font-semibold mb-4">Files</h2>
            <div className="space-y-2">
              {files.map(file => (
                <div key={file} className="border-b pb-2">
                  <Button
                    variant={selectedFile === file ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFile(file)}
                  >
                    <FileJson className="mr-2 h-4 w-4" />
                    {file}.json
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-3">
            {selectedFile ? (
              <div>
                {loading ? (
                  <div className="flex justify-center items-center h-64 border rounded-lg bg-white">
                    <div className="flex flex-col items-center">
                      <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mb-2" />
                      <span className="text-gray-500">Loading {selectedFile}.json...</span>
                    </div>
                  </div>
                ) : (
                  <Tabs defaultValue="raw">
                    <TabsList className="mb-4">
                      <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                      <TabsTrigger value="structure">Structure</TabsTrigger>
                      <TabsTrigger value="sections">Sections</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="raw">
                      <div className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-semibold">{selectedFile}.json</h2>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Copy to clipboard
                              navigator.clipboard.writeText(formatJson(fileContent));
                            }}
                          >
                            Copy JSON
                          </Button>
                        </div>
                        
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                          {formatJson(fileContent)}
                        </pre>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="structure">
                      <div className="border rounded-lg p-4 bg-white">
                        <h2 className="text-xl font-semibold mb-4">File Structure</h2>
                        
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium mb-2 flex items-center">
                              <Braces className="mr-2 h-4 w-4 text-blue-600" />
                              Root Properties
                            </h3>
                            
                            <ul className="list-disc pl-6 space-y-1">
                              {Object.keys(fileContent || {}).map(key => (
                                <li key={key} className="text-sm">
                                  <span className="font-mono text-blue-600">{key}</span>
                                  <span className="text-gray-500 ml-2">
                                    ({Array.isArray(fileContent[key]) 
                                      ? `Array[${fileContent[key].length}]` 
                                      : typeof fileContent[key]})
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {fileContent && fileContent.sections && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h3 className="font-medium mb-2">Sections ({fileContent.sections.length})</h3>
                              
                              <div className="text-sm">
                                <p className="mb-2">First section properties:</p>
                                
                                {fileContent.sections.length > 0 && (
                                  <ul className="list-disc pl-6 space-y-1">
                                    {Object.keys(fileContent.sections[0]).map(key => (
                                      <li key={key}>
                                        <span className="font-mono text-blue-600">{key}</span>
                                        <span className="text-gray-500 ml-2">
                                          ({Array.isArray(fileContent.sections[0][key]) 
                                            ? `Array[${fileContent.sections[0][key].length}]` 
                                            : typeof fileContent.sections[0][key]})
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="sections">
                      <div className="border rounded-lg p-4 bg-white">
                        <h2 className="text-xl font-semibold mb-4">Sections</h2>
                        
                        {fileContent && fileContent.sections ? (
                          <div className="space-y-4">
                            {fileContent.sections.map((section: any, index: number) => (
                              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium mb-2">{section.title || `Section ${index + 1}`}</h3>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium mb-1">ID:</p>
                                    <p className="font-mono text-blue-600">{section.id}</p>
                                  </div>
                                  
                                  <div>
                                    <p className="font-medium mb-1">Level:</p>
                                    <p>{section.level}</p>
                                  </div>
                                  
                                  <div>
                                    <p className="font-medium mb-1">Content:</p>
                                    <p>{Array.isArray(section.content) 
                                      ? `${section.content.length} chunks` 
                                      : 'No content'}</p>
                                  </div>
                                  
                                  <div>
                                    <p className="font-medium mb-1">Subsections:</p>
                                    <p>{section.subsections 
                                      ? `${section.subsections.length} subsections` 
                                      : 'No subsections'}</p>
                                  </div>
                                  
                                  <div>
                                    <p className="font-medium mb-1">Blocks:</p>
                                    <p>{section.blocks 
                                      ? `${section.blocks.length} blocks` 
                                      : 'No blocks'}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                            No sections found in this file
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            ) : (
              <div className="border rounded-lg p-6 bg-white h-64 flex items-center justify-center">
                <p className="text-gray-500">Select a file to view its content</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
