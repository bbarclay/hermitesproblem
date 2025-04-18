'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Section {
  title: string;
  id: string;
  level: string;
  content: string[];
}

interface ContentFile {
  filename: string;
  sections: Section[];
  order?: number;
}

interface TOCSection {
  file: string;
  title: string;
  id: string;
  level: string;
}

interface TOC {
  paper: {
    title: string;
    authors: string[];
    date: string;
    sections: TOCSection[];
  };
}

export default function SectionRenderingTest() {
  const [toc, setToc] = useState<TOC | null>(null);
  const [contentFiles, setContentFiles] = useState<Record<string, ContentFile>>({});
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<{
    duplicateSections: TOCSection[];
    missingSections: TOCSection[];
    missingFiles: string[];
    sectionsWithoutContent: TOCSection[];
    subsectionsWithoutParent: TOCSection[];
  }>({
    duplicateSections: [],
    missingSections: [],
    missingFiles: [],
    sectionsWithoutContent: [],
    subsectionsWithoutParent: [],
  });

  useEffect(() => {
    const fetchTOC = async () => {
      try {
        const response = await fetch('/api/content/toc.json');
        const data = await response.json();
        setToc(data);
        return data;
      } catch (error) {
        console.error('Error fetching TOC:', error);
        return null;
      }
    };

    const fetchContentFiles = async (tocData: TOC) => {
      const files: Record<string, ContentFile> = {};
      const missingFiles: string[] = [];

      // Get unique file names from TOC
      const uniqueFiles = [...new Set(tocData.paper.sections.map(section => section.file))];

      // Fetch each content file
      for (const file of uniqueFiles) {
        try {
          const response = await fetch(`/api/content/${file}.json`);
          if (response.ok) {
            const data = await response.json();
            files[file] = data;
          } else {
            missingFiles.push(file);
          }
        } catch (error) {
          console.error(`Error fetching content file ${file}:`, error);
          missingFiles.push(file);
        }
      }

      setContentFiles(files);
      return { files, missingFiles };
    };

    const runTests = (tocData: TOC, files: Record<string, ContentFile>, missingFiles: string[]) => {
      // Check for duplicate sections in TOC
      const sectionIds = tocData.paper.sections.map(section => section.id);
      const duplicateSections = tocData.paper.sections.filter(
        (section, index) => sectionIds.indexOf(section.id) !== index
      );

      // Check for sections in TOC that don't have content
      const sectionsWithoutContent = tocData.paper.sections.filter(section => {
        if (missingFiles.includes(section.file)) return false;
        
        const contentFile = files[section.file];
        if (!contentFile) return true;
        
        const sectionInContent = contentFile.sections.find(s => s.id === section.id);
        return !sectionInContent;
      });

      // Check for subsections without parent sections
      const subsectionsWithoutParent = tocData.paper.sections.filter(section => {
        if (section.level !== 'subsection') return false;
        
        // Find parent section (should have same file but level='section')
        const parentSection = tocData.paper.sections.find(
          s => s.file === section.file && s.level === 'section'
        );
        
        return !parentSection;
      });

      setTestResults({
        duplicateSections,
        missingSections: [], // We'll calculate this differently
        missingFiles,
        sectionsWithoutContent,
        subsectionsWithoutParent,
      });
    };

    const loadData = async () => {
      setLoading(true);
      const tocData = await fetchTOC();
      
      if (tocData) {
        const { files, missingFiles } = await fetchContentFiles(tocData);
        runTests(tocData, files, missingFiles);
      }
      
      setLoading(false);
    };

    loadData();
  }, []);

  const renderTestResults = () => {
    const hasIssues = 
      testResults.duplicateSections.length > 0 ||
      testResults.missingFiles.length > 0 ||
      testResults.sectionsWithoutContent.length > 0 ||
      testResults.subsectionsWithoutParent.length > 0;

    if (loading) {
      return (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Loading</AlertTitle>
          <AlertDescription>
            Running section rendering tests...
          </AlertDescription>
        </Alert>
      );
    }

    if (!hasIssues) {
      return (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">All Tests Passed</AlertTitle>
          <AlertDescription className="text-green-700">
            No issues found with section rendering.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Tabs defaultValue="duplicate">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="duplicate" className={testResults.duplicateSections.length > 0 ? "text-red-600" : ""}>
            Duplicate Sections {testResults.duplicateSections.length > 0 && `(${testResults.duplicateSections.length})`}
          </TabsTrigger>
          <TabsTrigger value="missing" className={testResults.missingFiles.length > 0 ? "text-red-600" : ""}>
            Missing Files {testResults.missingFiles.length > 0 && `(${testResults.missingFiles.length})`}
          </TabsTrigger>
          <TabsTrigger value="content" className={testResults.sectionsWithoutContent.length > 0 ? "text-red-600" : ""}>
            No Content {testResults.sectionsWithoutContent.length > 0 && `(${testResults.sectionsWithoutContent.length})`}
          </TabsTrigger>
          <TabsTrigger value="subsections" className={testResults.subsectionsWithoutParent.length > 0 ? "text-red-600" : ""}>
            Orphan Subsections {testResults.subsectionsWithoutParent.length > 0 && `(${testResults.subsectionsWithoutParent.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="duplicate">
          <Card>
            <CardHeader>
              <CardTitle>Duplicate Sections</CardTitle>
              <CardDescription>Sections with the same ID in the TOC</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.duplicateSections.length === 0 ? (
                <p className="text-green-600">No duplicate sections found.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {testResults.duplicateSections.map((section, index) => (
                    <li key={index} className="text-red-600">
                      {section.title} (ID: {section.id}, File: {section.file})
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="missing">
          <Card>
            <CardHeader>
              <CardTitle>Missing Files</CardTitle>
              <CardDescription>Content files referenced in TOC but not found</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.missingFiles.length === 0 ? (
                <p className="text-green-600">All content files were found.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {testResults.missingFiles.map((file, index) => (
                    <li key={index} className="text-red-600">
                      {file}.json
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Sections Without Content</CardTitle>
              <CardDescription>Sections in TOC that don't have corresponding content</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.sectionsWithoutContent.length === 0 ? (
                <p className="text-green-600">All sections have content.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {testResults.sectionsWithoutContent.map((section, index) => (
                    <li key={index} className="text-red-600">
                      {section.title} (ID: {section.id}, File: {section.file})
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subsections">
          <Card>
            <CardHeader>
              <CardTitle>Orphaned Subsections</CardTitle>
              <CardDescription>Subsections without a parent section in the same file</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.subsectionsWithoutParent.length === 0 ? (
                <p className="text-green-600">All subsections have parent sections.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {testResults.subsectionsWithoutParent.map((section, index) => (
                    <li key={index} className="text-red-600">
                      {section.title} (ID: {section.id}, File: {section.file})
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  const renderContentStructure = () => {
    if (!toc || Object.keys(contentFiles).length === 0) {
      return <p>No content to display</p>;
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Content Structure</h3>
        
        {toc.paper.sections
          .filter(section => section.level === 'section')
          .map(section => {
            const contentFile = contentFiles[section.file];
            const sectionContent = contentFile?.sections.find(s => s.id === section.id);
            
            // Find subsections in TOC
            const subsections = toc.paper.sections.filter(
              s => s.file === section.file && s.level === 'subsection'
            );
            
            return (
              <Card key={section.id} className="overflow-hidden">
                <CardHeader className={sectionContent ? "bg-green-50" : "bg-red-50"}>
                  <CardTitle className="flex items-center gap-2">
                    {sectionContent ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    {section.title}
                  </CardTitle>
                  <CardDescription>
                    File: {section.file}.json | ID: {section.id}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-4">
                  {subsections.length > 0 ? (
                    <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                      {subsections.map(subsection => {
                        // Check if subsection content exists in the file
                        const subsectionContent = contentFile?.sections.find(
                          s => s.id === subsection.id
                        );
                        
                        return (
                          <div 
                            key={subsection.id} 
                            className={`p-2 rounded ${
                              subsectionContent ? "bg-green-50" : "bg-red-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {subsectionContent ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-red-600" />
                              )}
                              <span className="font-medium">{subsection.title}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              ID: {subsection.id}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No subsections</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Section Rendering Test</h1>
        <p className="text-gray-600 mt-2">
          Verify that all sections and subsections are properly structured and can be rendered
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          {renderTestResults()}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Content Structure</h2>
          {renderContentStructure()}
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button onClick={() => window.location.reload()}>
          Run Tests Again
        </Button>
      </div>
    </div>
  );
}
