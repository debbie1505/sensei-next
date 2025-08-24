"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import Link from 'next/link';
import { 
  Calendar, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  Edit3,
  Trash2,
  Download
} from 'lucide-react';
import { type Profile } from '@/llm/schemas';

interface Task {
  id: string;
  title: string;
  due_date: string;
  start_date?: string;
  status: 'todo' | 'doing' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  category: 'testing' | 'essays' | 'letters' | 'applications' | 'financial_aid' | 'extracurriculars' | 'interviews' | 'research' | 'other';
  description?: string;
  notes?: string;
  school?: string;
  program?: string;
  tags?: string[];
  blockers?: string[];
  links?: string[];
  subtasks?: {
    title: string;
    due_date?: string;
    status?: 'todo' | 'doing' | 'blocked' | 'done';
  }[];
  source: {
    origin: 'sensei' | 'user' | 'import' | 'school';
    rationale?: string;
  };
}

interface Plan {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  meta: any;
  tasks: Task[];
}

export default function Timeline() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/timeline/generate');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPlans(result.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeline = async () => {
    setGenerating(true);
    setError('');

    try {
      // Get user profile
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please log in to generate a timeline');
        return;
      }

      // Get user profile from profiles table
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profileData) {
        setError('Please complete your profile first');
        return;
      }

      // Convert to Profile type
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

      const response = await fetch('/api/timeline/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          await fetchPlans(); // Refresh the plans
        } else {
          setError(result.error || 'Failed to generate timeline');
        }
      } else {
        setError('Failed to generate timeline');
      }
    } catch (error) {
      console.error('Timeline generation error:', error);
      setError('An error occurred while generating your timeline');
    } finally {
      setGenerating(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: 'todo' | 'doing' | 'done' | 'blocked') => {
    try {
      const supabase = createClient();
      await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);
      
      // Refresh plans
      await fetchPlans();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const supabase = createClient();
      await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);
      
      setEditingTask(null);
      await fetchPlans();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      await fetchPlans();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const downloadTimeline = (plan: Plan) => {
    const content = plan.tasks
      .map((task, index) => `${index + 1}. ${task.title} (Due: ${task.due_date}) - ${task.status}`)
      .join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline-${plan.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'text-green-600 bg-green-50';
      case 'doing': return 'text-blue-600 bg-blue-50';
      case 'todo': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-gray-600">Loading your timeline...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Timeline</h1>
              <p className="text-gray-600">Your personalized college application roadmap</p>
            </div>
            <button
              onClick={generateTimeline}
              disabled={generating}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              {generating ? 'Generating...' : 'Generate New Timeline'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Timeline Plans */}
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No timeline yet</h2>
            <p className="text-gray-600 mb-6">Generate your first personalized timeline to get started</p>
            <button
              onClick={generateTimeline}
              disabled={generating}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              {generating ? 'Generating...' : 'Create Timeline'}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{plan.title}</h2>
                    <p className="text-gray-600">
                      {plan.start_date} - {plan.end_date}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadTimeline(plan)}
                    className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>

                <div className="space-y-4">
                  {plan.tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <button
                              onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                              className={`p-1 rounded ${
                                task.status === 'done' ? 'text-green-600' : 'text-gray-400'
                              }`}
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                          
                                                     <div className="flex items-center text-sm text-gray-500 mb-2">
                             <Clock className="w-4 h-4 mr-1" />
                             Due: {task.due_date}
                             {task.start_date && ` (Start: ${task.start_date})`}
                           </div>
                           
                           <div className="flex items-center text-sm text-gray-500 mb-2">
                             <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700`}>
                               {task.category}
                             </span>
                           </div>
                           
                           {task.description && (
                             <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                           )}
                           
                           {task.school && (
                             <p className="text-gray-600 text-sm mb-2">School: {task.school}</p>
                           )}
                           
                           {task.tags && task.tags.length > 0 && (
                             <div className="flex flex-wrap gap-1 mb-2">
                               {task.tags.map(tag => (
                                 <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                   {tag}
                                 </span>
                               ))}
                             </div>
                           )}
                           
                           {task.subtasks && task.subtasks.length > 0 && (
                             <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                               <h4 className="text-sm font-medium text-gray-700 mb-2">Subtasks:</h4>
                               <div className="space-y-1">
                                 {task.subtasks.map((subtask, index) => (
                                   <div key={index} className="flex items-center text-sm">
                                     <div className={`w-2 h-2 rounded-full mr-2 ${
                                       subtask.status === 'done' ? 'bg-green-500' : 
                                       subtask.status === 'doing' ? 'bg-blue-500' : 
                                       subtask.status === 'blocked' ? 'bg-red-500' : 'bg-gray-300'
                                     }`}></div>
                                     <span className="text-gray-600">{subtask.title}</span>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                          
                          {editingTask === task.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                defaultValue={task.title}
                                className="w-full p-2 border rounded"
                                onBlur={(e) => updateTask(task.id, { title: e.target.value })}
                              />
                              <textarea
                                defaultValue={task.description}
                                className="w-full p-2 border rounded"
                                placeholder="Description"
                                onBlur={(e) => updateTask(task.id, { description: e.target.value })}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingTask(task.id)}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
