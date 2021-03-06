const { google } = require('googleapis');

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
];

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_DOC_CLIENT_EMAIL,
  key: process.env.GOOGLE_DOC_PRIVATE_KEY,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

const GoogleApi = {
  createDocument: async (title) => {
    return await drive.files.create({
      resource: {
        name : title,
        mimeType : 'application/vnd.google-apps.document',
        parents:[process.env.GOOGLE_DOC_ROOT_FOLDER_ID],
      },
      fields: 'id',
    });
  },

  getDocumentContent: async (documentId) => {
    return await drive.files.export({
      fileId: documentId,
      mimeType: 'text/html',
    });
  },

  getFileMeta: async (fileId, fields) => {
    return await drive.files.get({
      fileId,
      fields: fields || 'lastModifyingUser,modifiedTime',
    });
  },

  delete: (id) => {
    return drive.files.delete({
      fileId: id,
    });
  },

  createPermission: (fileId, role, emailAddress) => {
    return drive.permissions.create({
      fileId,
      fields: 'id,emailAddress,role',
      resource: {
        type: 'user',
        role,
        emailAddress,
      },
    });
  },

  /**
   * Updates file permissions. Sets a new role for one of its maintainers
   */
  updatePermission: (fileId, permissionId, role) => {
    return drive.permissions.update({
      fileId,
      permissionId,
      resource: { role },
    });
  },

  deletePermission: (fileId, permissionId) => {
    return drive.permissions.delete({
      fileId,
      permissionId,
    });
  },
};

module.exports = GoogleApi;
