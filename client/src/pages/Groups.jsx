
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  Lock,
  Globe,
  UserPlus,
  UserMinus,
  UsersRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const GROUPS_STORAGE_KEY = "campusGroups";
const MEMBERS_STORAGE_KEY = "campusGroupMembers";

function readGroups() {
  try {
    const savedGroups = localStorage.getItem(
      GROUPS_STORAGE_KEY
    );

    if (!savedGroups) {
      return [];
    }

    const parsedGroups = JSON.parse(savedGroups);

    if (!Array.isArray(parsedGroups)) {
      return [];
    }

    return parsedGroups;
  } catch (error) {
    console.error(
      "Unable to read campus groups:",
      error
    );

    return [];
  }
}

function readMemberships(userId) {
  if (!userId) {
    return {};
  }

  try {
    const savedMemberships =
      localStorage.getItem(
        MEMBERS_STORAGE_KEY
      );

    if (!savedMemberships) {
      return {};
    }

    const parsedMemberships =
      JSON.parse(savedMemberships);

    return (
      parsedMemberships[userId] || {}
    );
  } catch (error) {
    console.error(
      "Unable to read group memberships:",
      error
    );

    return {};
  }
}

function Groups() {
  const { currentUser } = useAuth();

  const [groups, setGroups] = useState([]);
  const [memberships, setMemberships] =
    useState({});

  const [searchQuery, setSearchQuery] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const loadGroups = () => {
    const savedGroups = readGroups();

    setGroups(savedGroups);

    if (currentUser?.id) {
      setMemberships(
        readMemberships(currentUser.id)
      );
    } else {
      setMemberships({});
    }
  };

  /* Load groups when page opens */
  useEffect(() => {
    loadGroups();
  }, [currentUser]);

  /* Reload when the page becomes active again */
  useEffect(() => {
    const handleFocus = () => {
      loadGroups();
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible"
      ) {
        loadGroups();
      }
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [currentUser]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        groups
          .map(
            (group) => group.category
          )
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [groups]);

  const filteredGroups = useMemo(() => {
    const searchText = searchQuery
      .trim()
      .toLowerCase();

    return groups.filter((group) => {
      const name =
        group.name?.toLowerCase() || "";

      const description =
        group.description?.toLowerCase() ||
        "";

      const department =
        group.department?.toLowerCase() ||
        "";

      const category =
        group.category?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        description.includes(searchText) ||
        department.includes(searchText) ||
        category.includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        group.category === categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    groups,
    searchQuery,
    categoryFilter,
  ]);

  const saveGroups = (updatedGroups) => {
    localStorage.setItem(
      GROUPS_STORAGE_KEY,
      JSON.stringify(updatedGroups)
    );

    setGroups(updatedGroups);
  };

  const saveMemberships = (
    updatedMemberships
  ) => {
    localStorage.setItem(
      MEMBERS_STORAGE_KEY,
      JSON.stringify(updatedMemberships)
    );
  };

  const handleJoinGroup = (groupId) => {
    if (!currentUser) {
      alert(
        "Please log in to join a group."
      );
      return;
    }

    const group = groups.find(
      (item) =>
        String(item.id) ===
        String(groupId)
    );

    if (!group) {
      return;
    }

    if (memberships[groupId]) {
      return;
    }

    const currentMembers =
      Number(group.members) || 0;

    const maxMembers =
      Number(group.maxMembers) || 0;

    if (
      maxMembers > 0 &&
      currentMembers >= maxMembers
    ) {
      alert(
        "This group has reached its maximum member limit."
      );
      return;
    }

    const updatedGroups = groups.map(
      (item) => {
        if (
          String(item.id) ===
          String(groupId)
        ) {
          return {
            ...item,
            members:
              (Number(item.members) || 0) +
              1,
          };
        }

        return item;
      }
    );

    const allMemberships = JSON.parse(
      localStorage.getItem(
        MEMBERS_STORAGE_KEY
      ) || "{}"
    );

    const userMemberships = {
      ...(allMemberships[
        currentUser.id
      ] || {}),
      [groupId]: true,
    };

    const updatedAllMemberships = {
      ...allMemberships,
      [currentUser.id]:
        userMemberships,
    };

    saveGroups(updatedGroups);
    saveMemberships(
      updatedAllMemberships
    );

    setMemberships(userMemberships);
  };

  const handleLeaveGroup = (groupId) => {
    if (!currentUser) {
      return;
    }

    if (!memberships[groupId]) {
      return;
    }

    const updatedGroups = groups.map(
      (item) => {
        if (
          String(item.id) ===
          String(groupId)
        ) {
          return {
            ...item,
            members: Math.max(
              0,
              (Number(item.members) || 0) -
                1
            ),
          };
        }

        return item;
      }
    );

    const allMemberships = JSON.parse(
      localStorage.getItem(
        MEMBERS_STORAGE_KEY
      ) || "{}"
    );

    const userMemberships = {
      ...(allMemberships[
        currentUser.id
      ] || {}),
    };

    delete userMemberships[groupId];

    const updatedAllMemberships = {
      ...allMemberships,
      [currentUser.id]:
        userMemberships,
    };

    saveGroups(updatedGroups);
    saveMemberships(
      updatedAllMemberships
    );

    setMemberships(userMemberships);
  };

  return (
    <div className="student-groups-page">
      {/* HEADER */}
      <div className="student-groups-header">
        <div>
          <span className="student-groups-label">
            CAMPUS COMMUNITY
          </span>

          <h1>Student Groups</h1>

          <p>
            Discover communities, study
            groups, clubs, and activities
            across Campus Connect.
          </p>
        </div>

        <div className="student-groups-total">
          <UsersRound size={20} />

          <div>
            <strong>
              {groups.length}
            </strong>

            <span>
              {groups.length === 1
                ? "Group"
                : "Groups"}
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="student-groups-toolbar">
        <div className="student-groups-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
          />
        </div>

        <select
          className="student-groups-filter"
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
        >
          {categories.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            )
          )}
        </select>
      </div>

      {/* RESULTS */}
      <div className="student-groups-results">
        <span>
          Showing{" "}
          <strong>
            {filteredGroups.length}
          </strong>{" "}
          {filteredGroups.length === 1
            ? "group"
            : "groups"}
        </span>

        {(searchQuery ||
          categoryFilter !== "All") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("All");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* EMPTY */}
      {filteredGroups.length === 0 ? (
        <div className="student-groups-empty">
          <div className="student-groups-empty-icon">
            <UsersRound size={30} />
          </div>

          <h2>
            {groups.length === 0
              ? "No groups available yet"
              : "No groups found"}
          </h2>

          <p>
            {groups.length === 0
              ? "Groups created by administrators will appear here."
              : "Try changing your search or category filter."}
          </p>
        </div>
      ) : (
        <div className="student-groups-grid">
          {filteredGroups.map(
            (group) => {
              const isJoined =
                Boolean(
                  memberships[group.id]
                );

              const memberCount =
                Number(group.members) || 0;

              const maxMembers =
                Number(
                  group.maxMembers
                ) || 0;

              const isFull =
                maxMembers > 0 &&
                memberCount >=
                  maxMembers;

              return (
                <article
                  key={group.id}
                  className="student-group-card"
                >
                  {/* IMAGE */}
                  <div className="student-group-image">
                    {group.image ? (
                      <img
                        src={group.image}
                        alt={group.name}
                      />
                    ) : (
                      <div className="student-group-placeholder">
                        <UsersRound
                          size={36}
                        />
                      </div>
                    )}

                    <span className="student-group-privacy">
                      {group.privacy ===
                      "Private" ? (
                        <>
                          <Lock
                            size={13}
                          />
                          Private
                        </>
                      ) : (
                        <>
                          <Globe
                            size={13}
                          />
                          Public
                        </>
                      )}
                    </span>
                  </div>

                  {/* BODY */}
                  <div className="student-group-body">
                    <div className="student-group-category">
                      {group.category ||
                        "General"}
                    </div>

                    <h2>
                      {group.name}
                    </h2>

                    <p className="student-group-description">
                      {group.description ||
                        "No description available."}
                    </p>

                    <div className="student-group-meta">
                      <span>
                        <Users size={15} />
                        {memberCount} members
                      </span>

                      {maxMembers >
                        0 && (
                        <span>
                          Max{" "}
                          {maxMembers}
                        </span>
                      )}
                    </div>

                    {group.department && (
                      <div className="student-group-department">
                        {group.department}
                      </div>
                    )}

                    {currentUser ? (
                      <button
                        type="button"
                        className={`student-group-action ${
                          isJoined
                            ? "joined"
                            : ""
                        }`}
                        disabled={
                          !isJoined &&
                          isFull
                        }
                        onClick={() =>
                          isJoined
                            ? handleLeaveGroup(
                                group.id
                              )
                            : handleJoinGroup(
                                group.id
                              )
                        }
                      >
                        {isJoined ? (
                          <>
                            <UserMinus
                              size={17}
                            />
                            Leave Group
                          </>
                        ) : (
                          <>
                            <UserPlus
                              size={17}
                            />
                            {isFull
                              ? "Group Full"
                              : "Join Group"}
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="student-group-action"
                        onClick={() =>
                          alert(
                            "Please log in to join a group."
                          )
                        }
                      >
                        <UserPlus
                          size={17}
                        />
                        Join Group
                      </button>
                    )}
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default Groups;