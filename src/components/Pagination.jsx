// import React from 'react';

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         style={{ padding: '6px 12px', marginRight: '10px' }}
//       >
//         Previous
//       </button>
//       <span style={{ alignSelf: 'center' }}>Page {currentPage} of {totalPages}</span>
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         style={{ padding: '6px 12px', marginLeft: '10px' }}
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default Pagination;

import React from 'react';
import { Button, Stack, Typography } from '@mui/material';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{ mt: 4 }}
    >
      <Button
        variant="contained"
        color="primary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      <Typography variant="body1">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </Typography>

      <Button
        variant="contained"
        color="primary"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </Stack>
  );
};

export default Pagination;