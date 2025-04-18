'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, FileSearch } from 'lucide-react';
import { getUnparsedTeXElements } from '@/utils/texDebugger';
import TexParser from '@/components/tex/TexParser';

export default function TexDebugPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<any | null>(null);
  const [unparsedElements, setUnparsedElements] = useState<any[]>([]);
  
  // Load TOC data
  useEffect(() => {
    fetch('/content/toc.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.paper && data.paper.sections) {
          setSections(data.paper.sections);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading TOC:', err);
        setLoading(false);
      });
  }, []);
  
  // Load section content when a file is selected
  useEffect(() => {
    if (!selectedFile) return;
    
    setLoading(true);
    
    fetch(`/content/${selectedFile}.json`)
      .then(res => res.json())
      .then(data => {
        if (data && data.sections && data.sections.length > 0) {
          setSelectedSection(data.sections[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(`Error loading ${selectedFile}:`, err);
        setLoading(false);
      });
  }, [selectedFile]);
  
  // Find unparsed TeX elements when a section is selected
  useEffect(() => {
    if (!selectedSection) return;
    
    const elements: any[] = [];
    
    // Check section content
    if (selectedSection.content) {
      const content = selectedSection.content.join('\n');
      const unparsed = getUnparsedTeXElements(content);
      
      unparsed.forEach(element => {
        elements.push({
          ...element,
          location: 'section',
          sectionId: selectedSection.id
        });
      });
    }
    
    // Check subsections
    if (selectedSection.subsections) {
      selectedSection.subsections.forEach((subsection: any) => {
        if (subsection.content) {
          const content = subsection.content.join('\n');
          const unparsed = getUnparsedTeXElements(content);
          
          unparsed.forEach((element: any) => {
            elements.push({
              ...element,
              location: 'subsection',
              sectionId: selectedSection.id,
              subsectionId: subsection.id
            });
          });
        }
      });
    }
    
    setUnparsedElements(elements);
  }, [selectedSection]);
  
  // Group files by name
  const fileGroups = sections.reduce((groups: any, section: any) => {
    if (!groups[section.file]) {
      groups[section.file] = [];
    }
    groups[section.file].push(section);
    return groups;
  }, {});
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">TeX Debug Page</h1>
      <p className="text-gray-600 mb-8">
        This page helps identify unparsed TeX elements in your content.
      </p>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 border rounded-lg p-4 bg-white">
            <h2 className="text-xl font-semibold mb-4">Files</h2>
            <div className="space-y-2">
              {Object.entries(fileGroups).map(([file, sections]: [string, any]) => (
                <div key={file} className="border-b pb-2">
                  <Button
                    variant={selectedFile === file ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFile(file)}
                  >
                    <FileSearch className="mr-2 h-4 w-4" />
                    {file}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-3">
            {selectedSection ? (
              <Tabs defaultValue="content">
                <TabsList className="mb-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="unparsed">
                    Unparsed Elements ({unparsedElements.length})
                  </TabsTrigger>
                  <TabsTrigger value="debug">Debug View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
                  <div className="border rounded-lg p-6 bg-white">
                    <h2 className="text-2xl font-bold mb-4">{selectedSection.title}</h2>
                    
                    <TexParser 
                      content={selectedSection.content.join('\n')} 
                      debug={false} 
                    />
                    
                    {selectedSection.subsections && selectedSection.subsections.length > 0 && (
                      <div className="mt-8">
                        {selectedSection.subsections.map((subsection: any) => (
                          <div key={subsection.id} className="mt-6">
                            <h3 className="text-xl font-semibold mb-4">{subsection.title}</h3>
                            
                            <TexParser 
                              content={subsection.content.join('\n')} 
                              debug={false} 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="unparsed">
                  <div className="border rounded-lg p-6 bg-white">
                    <h2 className="text-2xl font-bold mb-4">Unparsed TeX Elements</h2>
                    
                    {unparsedElements.length === 0 ? (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle>No unparsed elements</AlertTitle>
                        <AlertDescription>
                          All TeX elements in this section are properly parsed.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div>
                        <Alert className="bg-yellow-50 border-yellow-200 mb-4">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertTitle>Unparsed elements found</AlertTitle>
                          <AlertDescription>
                            Found {unparsedElements.length} unparsed TeX elements in this section.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="space-y-4">
                          {unparsedElements.map((element, index) => (
                            <div key={index} className="border rounded p-4 bg-gray-50">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <span className="font-medium">Type: </span>
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                    {element.type}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {element.location === 'subsection' ? 'Subsection' : 'Section'}
                                </div>
                              </div>
                              
                              <div className="mt-2 p-3 bg-white border rounded font-mono text-sm overflow-x-auto">
                                {element.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="debug">
                  <div className="border rounded-lg p-6 bg-white">
                    <h2 className="text-2xl font-bold mb-4">Debug View</h2>
                    
                    <TexParser 
                      content={selectedSection.content.join('\n')} 
                      debug={true} 
                    />
                    
                    {selectedSection.subsections && selectedSection.subsections.length > 0 && (
                      <div className="mt-8">
                        {selectedSection.subsections.map((subsection: any) => (
                          <div key={subsection.id} className="mt-6">
                            <h3 className="text-xl font-semibold mb-4">{subsection.title}</h3>
                            
                            <TexParser 
                              content={subsection.content.join('\n')} 
                              debug={true} 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
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
