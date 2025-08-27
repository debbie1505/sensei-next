"use client";
import { Calendar, MessageCircle, Target, CheckCircle, Clock, Star, Sparkles } from "lucide-react";

export default function ProductPreview() {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 dark:from-gray-900 dark:via-gray-800/30 dark:to-blue-900/20 relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-blue-500/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-32 left-32 w-6 h-6 bg-indigo-500/20 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-purple-500/40 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-full px-6 py-3 mb-8 text-sm font-medium text-blue-700 dark:text-blue-200 shadow-lg">
            <Sparkles className="w-4 h-4" />
            Product Preview
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
            See Sensei in Action
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-200 max-w-3xl mx-auto">
            Experience how Sensei organizes your college application journey
          </p>
        </div>

        {/* Enhanced 3D Product Interface Mockup */}
        <div className="relative">
          {/* 3D Shadow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-600/20 dark:from-gray-600/20 dark:to-gray-800/20 rounded-3xl transform translate-y-8 blur-2xl"></div>
          
          {/* Main Interface */}
          <div className="bg-white/90 dark:bg-card/90 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-border/50 shadow-2xl max-w-6xl mx-auto relative transform hover:scale-[1.02] transition-all duration-500">
            {/* Header Bar */}
            <div className="flex items-center justify-between mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/30 dark:border-blue-700/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sensei Dashboard</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Live</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Enhanced Timeline Panel */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Your Timeline</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">Complete Common App</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Due: Oct 15, 2024</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500 drop-shadow-lg" />
                  </div>
                  
                  <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-yellow-700 dark:group-hover:text-yellow-300 transition-colors">Submit Early Decision</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Due: Nov 1, 2024</p>
                    </div>
                    <Clock className="w-6 h-6 text-yellow-500 drop-shadow-lg" />
                  </div>
                  
                  <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/20 dark:to-gray-700/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-4 h-4 bg-gray-400 rounded-full shadow-lg"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Request Letters of Rec</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Due: Dec 1, 2024</p>
                    </div>
                    <div className="w-6 h-6"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Essay Feedback Panel */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Essay Feedback</h3>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Personal Statement</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current drop-shadow-sm" />
                        <Star className="w-5 h-5 text-yellow-500 fill-current drop-shadow-sm" />
                        <Star className="w-5 h-5 text-yellow-500 fill-current drop-shadow-sm" />
                        <Star className="w-5 h-5 text-yellow-500 fill-current drop-shadow-sm" />
                        <Star className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">4/5 - Strong foundation</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-card/60 rounded-xl border border-green-200/30 dark:border-green-700/30">
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-200">Clear voice and authentic story</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-card/60 rounded-xl border border-yellow-200/30 dark:border-yellow-700/30">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-200">Consider expanding on impact</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-card/60 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-200">Grammar and structure are solid</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Bottom Stats */}
            <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200/30 dark:border-blue-700/30 shadow-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Tasks Completed</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200/30 dark:border-green-700/30 shadow-lg">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">85%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">On Track</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-200/30 dark:border-purple-700/30 shadow-lg">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">8</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Schools Applied</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="text-center mt-16">
          <button 
            onClick={() => {
              const element = document.getElementById('waitlist');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 text-lg"
          >
            Get early access
          </button>
        </div>
      </div>
    </section>
  );
}
