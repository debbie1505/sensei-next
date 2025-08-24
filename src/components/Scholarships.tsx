"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import Link from 'next/link';
import { 
  Search, 
  Bookmark, 
  ExternalLink, 
  ArrowLeft,
  Filter,
  Calendar,
  DollarSign,
  Tag
} from 'lucide-react';
import { type Profile } from '@/llm/schemas';

interface Scholarship {
  id?: string;
  title: string;
  description: string;
  url?: string;
  tags: string[];
  deadline: string;
  amount: number;
  eligibility: string;
  fit_score: number;
  notes?: string;
  source?: 'database' | 'ai';
}

export default function Scholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);

  const availableTags = [
    'STEM', 'Arts', 'Business', 'Engineering', 'Medicine', 'Law', 'Education',
    'Minority', 'Women', 'First-Generation', 'Low-Income', 'International',
    'Merit-Based', 'Need-Based', 'State-Specific', 'National'
  ];

  useEffect(() => {
    fetchSavedScholarships();
  }, []);

  const fetchSavedScholarships = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: saves } = await supabase
        .from('user_saves')
        .select('kb_item_id')
        .eq('user_id', user.id);

      if (saves) {
        setSavedScholarships(saves.map(save => save.kb_item_id));
      }
    } catch (error) {
      console.error('Failed to fetch saved scholarships:', error);
    }
  };

  const searchScholarships = async () => {
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please log in to search scholarships');
        return;
      }

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profileData) {
        alert('Please complete your profile first');
        return;
      }

      const profile: Profile = {
        grade: profileData.grade,
        gpa: profileData.gpa,
        major_interests: profileData.major_interests || [],
        state: profileData.state || '',
        citizenship: profileData.citizenship || '',
        applicant_type: profileData.applicant_type || '',
        college_type: profileData.college_type || '',
        goals: profileData.goals || ''
      };

      const tags = selectedTags.length > 0 ? selectedTags : profile.major_interests;

      const response = await fetch('/api/scholarships/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile, tags }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setScholarships(result.data.matches);
        }
      }
    } catch (error) {
      console.error('Scholarship search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaved = async (scholarshipId: string) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const isSaved = savedScholarships.includes(scholarshipId);

      if (isSaved) {
        // Remove from saved
        await supabase
          .from('user_saves')
          .delete()
          .eq('user_id', user.id)
          .eq('kb_item_id', scholarshipId);
        
        setSavedScholarships(prev => prev.filter(id => id !== scholarshipId));
      } else {
        // Add to saved
        await supabase
          .from('user_saves')
          .insert({
            user_id: user.id,
            kb_item_id: scholarshipId
          });
        
        setSavedScholarships(prev => [...prev, scholarshipId]);
      }
    } catch (error) {
      console.error('Failed to toggle saved:', error);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scholarship Matcher</h1>
          <p className="text-gray-600">Find scholarships that match your profile and interests</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Scholarships
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 8).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={searchScholarships}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Find Matches'}
              </button>
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filtering by:</span>
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                >
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-1 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {scholarships.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Found {filteredScholarships.length} scholarships
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredScholarships.map((scholarship, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {scholarship.title}
                    </h3>
                    <button
                      onClick={() => scholarship.id && toggleSaved(scholarship.id)}
                      className={`p-2 rounded-full transition-colors ${
                        scholarship.id && savedScholarships.includes(scholarship.id)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {scholarship.description}
                  </p>

                                     <div className="space-y-2 mb-4">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center text-sm text-gray-500">
                         <DollarSign className="w-4 h-4 mr-2" />
                         {formatAmount(scholarship.amount)}
                       </div>
                       <div className="flex items-center text-sm">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                           scholarship.fit_score >= 8 ? 'bg-green-100 text-green-700' :
                           scholarship.fit_score >= 6 ? 'bg-yellow-100 text-yellow-700' :
                           'bg-red-100 text-red-700'
                         }`}>
                           Fit: {scholarship.fit_score}/10
                         </span>
                       </div>
                     </div>
                     
                     <div className="flex items-center text-sm text-gray-500">
                       <Calendar className="w-4 h-4 mr-2" />
                       Due: {formatDate(scholarship.deadline)}
                     </div>

                     {scholarship.source && (
                       <div className="flex items-center text-sm text-gray-500">
                         <Tag className="w-4 h-4 mr-2" />
                         {scholarship.source === 'database' ? 'Curated' : 'AI Generated'}
                       </div>
                     )}
                     
                     {scholarship.notes && (
                       <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                         {scholarship.notes}
                       </div>
                     )}
                   </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {scholarship.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    {scholarship.url && (
                      <a
                        href={scholarship.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Apply
                      </a>
                    )}
                    <button
                      className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={() => alert(scholarship.eligibility)}
                    >
                      View Eligibility
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No scholarships found</h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find more matches
            </p>
            <button
              onClick={searchScholarships}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Searching...' : 'Search Scholarships'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
