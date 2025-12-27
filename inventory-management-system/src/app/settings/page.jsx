"use client";

import React, { useState } from "react";
import { Settings, User, Mail, Globe, Moon, Sun, Save, Shield, Bell } from "lucide-react";

const mockSettings = [
  { label: "Username", value: "Ahmad Foods", type: "text", icon: User, category: "Account" },
  { label: "Email", value: "purifasecurelife@gmail.com", type: "text", icon: Mail, category: "Account" },
  { label: "Dark Mode", value: false, type: "toggle", icon: Moon, category: "Appearance" },
  { label: "Language", value: "English", type: "text", icon: Globe, category: "Preferences" },
  { label: "Notifications", value: true, type: "toggle", icon: Bell, category: "Preferences" },
  { label: "Two-Factor Auth", value: false, type: "toggle", icon: Shield, category: "Security" },
];

const SettingsPage = () => {
  const [userSettings, setUserSettings] = useState(mockSettings);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleChange = (index) => {
    const settingsCopy = [...userSettings];
    settingsCopy[index].value = !settingsCopy[index].value;
    setUserSettings(settingsCopy);

    // If Dark Mode toggle is changed
    if (settingsCopy[index].label === "Dark Mode") {
      setIsDarkMode(settingsCopy[index].value);
    }
  };

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Group settings by category
  const groupedSettings = userSettings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {});

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50'} p-6 transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 ${isDarkMode ? 'bg-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'} rounded-2xl shadow-lg`}>
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your account preferences</p>
            </div>
          </div>
          <button
            onClick={handleSaveSettings}
            className={`flex items-center gap-2 px-5 py-2.5 ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
          >
            <Save className="w-4 h-4" />
            <span className="font-medium">Save Changes</span>
          </button>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className={`${isDarkMode ? 'bg-green-900 border-green-700 text-green-200' : 'bg-green-50 border-green-200 text-green-800'} border rounded-xl p-4 flex items-center gap-3`}>
            <div className={`p-2 ${isDarkMode ? 'bg-green-800' : 'bg-green-100'} rounded-lg`}>
              <Save className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold">Settings saved successfully!</p>
              <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>Your preferences have been updated.</p>
            </div>
          </div>
        )}

        {/* Settings Categories */}
        {Object.entries(groupedSettings).map(([category, settings]) => (
          <div key={category} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-md overflow-hidden border ${isDarkMode ? '' : 'border-gray-100'}`}>
            <div className={`px-6 py-4 ${isDarkMode ? 'bg-gray-750 border-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100'} border-b`}>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{category}</h2>
            </div>
            <div className="p-6 space-y-4">
              {settings.map((setting) => {
                const Icon = setting.icon;
                const globalIndex = userSettings.findIndex(s => s.label === setting.label);
                
                return (
                  <div key={setting.label} className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-750 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition-all duration-200`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-sm`}>
                        <Icon className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{setting.label}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {setting.type === "toggle" 
                            ? `${setting.value ? 'Enabled' : 'Disabled'}`
                            : `Current: ${setting.value}`
                          }
                        </p>
                      </div>
                    </div>
                    <div>
                      {setting.type === "toggle" ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={setting.value}
                            onChange={() => handleToggleChange(globalIndex)}
                          />
                          <div className={`w-14 h-7 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full peer peer-focus:ring-4 ${isDarkMode ? 'peer-focus:ring-indigo-900' : 'peer-focus:ring-indigo-300'} transition peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all ${isDarkMode ? 'peer-checked:bg-indigo-600' : 'peer-checked:bg-indigo-600'}`}></div>
                        </label>
                      ) : (
                        <input
                          type="text"
                          className={`px-4 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-800'} border rounded-xl focus:outline-none ${isDarkMode ? 'focus:ring-2 focus:ring-indigo-500' : 'focus:ring-2 focus:ring-indigo-500'} transition-all min-w-[280px]`}
                          value={setting.value}
                          onChange={(e) => {
                            const settingsCopy = [...userSettings];
                            settingsCopy[globalIndex].value = e.target.value;
                            setUserSettings(settingsCopy);
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Theme Preview Card */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-md p-6 border ${isDarkMode ? '' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3 mb-4">
            {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-indigo-600" />}
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Current Theme</h3>
          </div>
          <div className={`p-4 ${isDarkMode ? 'bg-gray-750' : 'bg-gradient-to-br from-indigo-50 to-purple-50'} rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-indigo-100'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              You are currently using <span className={`font-semibold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>. 
              Toggle the Dark Mode setting above to switch themes.
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className={`${isDarkMode ? 'bg-indigo-900/30 border-indigo-700/50' : 'bg-indigo-50'} rounded-2xl p-6 border ${isDarkMode ? '' : 'border-indigo-100'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-indigo-200' : 'text-indigo-800'}`}>
            <span className="font-semibold">💡 Tip:</span> Changes are automatically saved when you click the "Save Changes" button. 
            Make sure to review your settings before saving.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;