import React from 'react';

const MemberList = ({ members }) => {
  return (
    <div className="absolute top-16 left-1/4 bg-white text-black border rounded shadow-lg p-4 z-10">
      <h3 className="text-lg font-bold mb-2">Permanent Members</h3>
      <ul>
        {members.map((member, index) => (
          <li key={index} className="py-1">
            {member}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;

