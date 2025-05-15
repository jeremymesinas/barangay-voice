import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface AnnouncementProps {
  title: string;
  description: string;
  timestamp?: string;  // Make it optional with ?
}

export default function AnnouncementCard({ 
  title, 
  description, 
  timestamp 
}: AnnouncementProps) {
  // Format the timestamp if it exists
  const formattedDate = timestamp 
    ? new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {formattedDate && (
          <Text style={styles.timestamp}>{formattedDate}</Text>
        )}
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    borderLeftWidth: 5,
    borderColor: "#D5305A",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
    marginRight: 10,
  },
  description: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    alignSelf: 'flex-end',
  },
});