// src/components/admin/UserDetailsModal.jsx
import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

const UserDetailsModal = ({ isOpen, onClose, user, onUpdateStatus }) => {
  const [status, setStatus] = useState(user?.status || 'pending');
  const [notes, setNotes] = useState(user?.adminNotes || '');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onUpdateStatus(user.id, status, notes);
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg">
      <div className="space-y-6">
        {/* User Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{user.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sphere</p>
            <p className="font-medium">{user.sphere || 'Not selected'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Experience</p>
            <p className="font-medium">{user.experience || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Submitted</p>
            <p className="font-medium">{new Date(user.submittedAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Message */}
        {user.message && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Message</p>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-900">{user.message}</p>
            </div>
          </div>
        )}

        {/* Update Status Form */}
        <form onSubmit={handleSubmit} className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Update Status</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="invited">Invitation Sent</option>
                <option value="onboarded">Onboarded</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add private notes about this user..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                Update Status
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;