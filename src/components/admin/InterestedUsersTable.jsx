// src/components/admin/InterestedUsersTable.jsx
import React, { useState } from 'react';
import Button from '../common/Button';
import {
  Eye,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
  User,
  MoreVertical,
  Filter,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Check,
  AlertCircle
} from 'lucide-react';

const InterestedUsersTable = ({ 
  users, 
  onView, 
  onSendInvite, 
  onBulkAction,
  compact = false,
  onRefresh,
  loading = false,
  totalCount = 0,
  currentPage = 1,
  onPageChange,
  itemsPerPage = 10
}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'submittedAt', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);

  // Status badge configuration
  const statusConfig = {
    pending: { 
      label: 'Pending', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
      iconColor: 'text-yellow-600'
    },
    invited: { 
      label: 'Invited', 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Mail,
      iconColor: 'text-blue-600'
    },
    onboarded: { 
      label: 'Onboarded', 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    rejected: { 
      label: 'Rejected', 
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
      iconColor: 'text-red-600'
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  // Handle individual select
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.sphere?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'submittedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortConfig.key === 'name') {
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Handle bulk invite
  const handleBulkInvite = async () => {
    if (selectedUsers.length === 0) return;
    
    setActionInProgress('bulk-invite');
    try {
      await onBulkAction?.('invite', selectedUsers);
      setSelectedUsers([]);
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle export
  const handleExport = () => {
    const dataToExport = filteredUsers.map(user => ({
      Name: `${user.firstName} ${user.lastName}`,
      Email: user.email,
      Sphere: user.sphere || 'Not selected',
      Status: user.status || 'pending',
      Submitted: new Date(user.submittedAt).toLocaleDateString()
    }));
    
    const csv = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interested-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interested users yet</h3>
          <p className="text-sm text-gray-500 mb-6">
            When users express interest in joining, they'll appear here.
          </p>
          <Button variant="primary" onClick={onRefresh} size="sm">
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header with Actions */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">Interested Users</h2>
            <span className="px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
              {totalCount || users.length} total
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 border rounded-lg transition-colors ${
                showFilters ? 'bg-indigo-50 border-indigo-300' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4 text-gray-600" />
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Export to CSV"
            >
              <Download className="h-4 w-4 text-gray-600" />
            </button>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-gray-300">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} selected
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBulkInvite}
                  loading={actionInProgress === 'bulk-invite'}
                >
                  Send Invites
                </Button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Status
                </label>
                <select className="w-full text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="invited">Invited</option>
                  <option value="onboarded">Onboarded</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Sphere
                </label>
                <select className="w-full text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">All Spheres</option>
                  <option value="business">Business</option>
                  <option value="technology">Technology</option>
                  <option value="education">Education</option>
                  <option value="ministry">Ministry</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Date Range
                </label>
                <input
                  type="date"
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <ArrowUpDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              {!compact && (
                <>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('sphere')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Sphere</span>
                      <ArrowUpDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </>
              )}
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort('submittedAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Submitted</span>
                  <ArrowUpDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => {
              const StatusIcon = statusConfig[user.status]?.icon || AlertCircle;
              const isSelected = selectedUsers.includes(user.id);
              
              return (
                <tr 
                  key={user.id} 
                  className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-indigo-50/50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectUser(user.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </td>
                  {!compact && (
                    <>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {user.sphere || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[user.status]?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          <StatusIcon className={`h-3 w-3 mr-1 ${statusConfig[user.status]?.iconColor || 'text-gray-600'}`} />
                          {statusConfig[user.status]?.label || user.status || 'Pending'}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(user)}
                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {user.status === 'pending' && (
                        <button
                          onClick={() => {
                            setActionInProgress(user.id);
                            onSendInvite(user).finally(() => setActionInProgress(null));
                          }}
                          disabled={actionInProgress === user.id}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Send invite"
                        >
                          {actionInProgress === user.id ? (
                            <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      
                      {user.status === 'invited' && (
                        <span className="text-xs text-blue-600 font-medium">Invite sent</span>
                      )}
                      
                      {user.status === 'onboarded' && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
            <span className="font-medium">{totalCount || users.length}</span> results
          </div>
          
          {onPageChange && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {Math.ceil((totalCount || users.length) / itemsPerPage)}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil((totalCount || users.length) / itemsPerPage)}
                className="p-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterestedUsersTable;