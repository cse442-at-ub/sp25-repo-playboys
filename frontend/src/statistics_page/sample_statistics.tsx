import { useEffect, useState } from 'react';

// Define types as in your main component
type TimeFrame = 'Last Month' | 'Last 90 Days' | 'Last Year';
type ContentType = 'Top Artists' | 'Top Songs' | 'Top Albums';

interface ListeningItem {
  id: string;
  name: string;
  imageUrl: string;
  playCount: number;
  playTimeMinutes: number; // Total minutes spent listening
  playTimePercentage: number; // Percentage of total listening time
  rank: number;
}

interface StatisticsProps {
  topArtistsLastMonth: ListeningItem[];
  topArtistsLast90Days: ListeningItem[];
  topArtistsLastYear: ListeningItem[];
  topSongsLastMonth: ListeningItem[];
  topSongsLast90Days: ListeningItem[];
  topSongsLastYear: ListeningItem[];
  topAlbumsLastMonth: ListeningItem[];
  topAlbumsLast90Days: ListeningItem[];
  topAlbumsLastYear: ListeningItem[];
}

// Mock image URLs using placeholder
const getPlaceholderImageUrl = (id: number) => `/api/placeholder/300/300`;

// Sample data for testing
export const SampleStatistics: StatisticsProps = {
  // Top Artists
  topArtistsLastMonth: [
    { id: 'a1', name: 'Taylor Swift', imageUrl: getPlaceholderImageUrl(1), playCount: -1, playTimeMinutes: 568, playTimePercentage: 80.0, rank: 1 },
    { id: 'a2', name: 'The Weeknd', imageUrl: getPlaceholderImageUrl(2), playCount: 98, playTimeMinutes: 392, playTimePercentage: 2, rank: 2 },
    { id: 'a3', name: 'Billie Eilish', imageUrl: getPlaceholderImageUrl(3), playCount: 87, playTimeMinutes: 348, playTimePercentage: 2, rank: 3 },
    { id: 'a4', name: 'Drake', imageUrl: getPlaceholderImageUrl(4), playCount: 76, playTimeMinutes: 304, playTimePercentage: 1, rank: 4 },
    { id: 'a5', name: 'Doja Cat', imageUrl: getPlaceholderImageUrl(5), playCount: 54, playTimeMinutes: 216, playTimePercentage: 1, rank: 5 },
    { id: 'a6', name: 'Kendrick Lamar', imageUrl: getPlaceholderImageUrl(6), playCount: 43, playTimeMinutes: 172, playTimePercentage: 9.8, rank: 6 },
    { id: 'a7', name: 'SZA', imageUrl: getPlaceholderImageUrl(7), playCount: 37, playTimeMinutes: 148, playTimePercentage: 8.4, rank: 7 },
    { id: 'a8', name: 'Bad Bunny', imageUrl: getPlaceholderImageUrl(8), playCount: 32, playTimeMinutes: 128, playTimePercentage: 7.3, rank: 8 },
    { id: 'a9', name: 'Tyler, The Creator', imageUrl: getPlaceholderImageUrl(9), playCount: 28, playTimeMinutes: 112, playTimePercentage: 6.4, rank: 9 },
    { id: 'a10', name: 'Olivia Rodrigo', imageUrl: getPlaceholderImageUrl(10), playCount: 26, playTimeMinutes: 104, playTimePercentage: 5.9, rank: 10 },
    { id: 'a11', name: 'Lana Del Rey', imageUrl: getPlaceholderImageUrl(11), playCount: 24, playTimeMinutes: 96, playTimePercentage: 5.4, rank: 11 },
    { id: 'a12', name: 'Frank Ocean', imageUrl: getPlaceholderImageUrl(12), playCount: 22, playTimeMinutes: 88, playTimePercentage: 5.0, rank: 12 },
    { id: 'a13', name: 'Ariana Grande', imageUrl: getPlaceholderImageUrl(13), playCount: 19, playTimeMinutes: 76, playTimePercentage: 4.3, rank: 13 },
    { id: 'a14', name: 'Beyoncé', imageUrl: getPlaceholderImageUrl(14), playCount: 17, playTimeMinutes: 68, playTimePercentage: 3.8, rank: 14 },
    { id: 'a15', name: 'Travis Scott', imageUrl: getPlaceholderImageUrl(15), playCount: 15, playTimeMinutes: 60, playTimePercentage: 3.4, rank: 15 },
    { id: 'a16', name: 'Dua Lipa', imageUrl: getPlaceholderImageUrl(16), playCount: 14, playTimeMinutes: 56, playTimePercentage: 3.2, rank: 16 },
    { id: 'a17', name: 'Harry Styles', imageUrl: getPlaceholderImageUrl(17), playCount: 13, playTimeMinutes: 52, playTimePercentage: 2.9, rank: 17 },
    { id: 'a18', name: 'The 1975', imageUrl: getPlaceholderImageUrl(18), playCount: 12, playTimeMinutes: 48, playTimePercentage: 2.7, rank: 18 },
    { id: 'a19', name: 'ROSALÍA', imageUrl: getPlaceholderImageUrl(19), playCount: 11, playTimeMinutes: 44, playTimePercentage: 2.5, rank: 19 },
    { id: 'a20', name: 'Post Malone', imageUrl: getPlaceholderImageUrl(20), playCount: 10, playTimeMinutes: 40, playTimePercentage: 2.3, rank: 20 },
  ],
  
  topArtistsLast90Days: [
    { id: 'a2', name: 'The Weeknd', imageUrl: getPlaceholderImageUrl(2), playCount: 287, playTimeMinutes: 1148, playTimePercentage: 24.7, rank: 1 },
    { id: 'a1', name: 'Taylor Swift', imageUrl: getPlaceholderImageUrl(1), playCount: 264, playTimeMinutes: 1056, playTimePercentage: 22.7, rank: 2 },
    { id: 'a3', name: 'Billie Eilish', imageUrl: getPlaceholderImageUrl(3), playCount: 215, playTimeMinutes: 860, playTimePercentage: 18.5, rank: 3 },
    { id: 'a4', name: 'Drake', imageUrl: getPlaceholderImageUrl(4), playCount: 189, playTimeMinutes: 756, playTimePercentage: 16.3, rank: 4 },
    { id: 'a6', name: 'Kendrick Lamar', imageUrl: getPlaceholderImageUrl(6), playCount: 143, playTimeMinutes: 572, playTimePercentage: 12.3, rank: 5 },
    { id: 'a5', name: 'Doja Cat', imageUrl: getPlaceholderImageUrl(5), playCount: 132, playTimeMinutes: 528, playTimePercentage: 11.4, rank: 6 },
    { id: 'a8', name: 'Bad Bunny', imageUrl: getPlaceholderImageUrl(8), playCount: 112, playTimeMinutes: 448, playTimePercentage: 9.6, rank: 7 },
    { id: 'a7', name: 'SZA', imageUrl: getPlaceholderImageUrl(7), playCount: 104, playTimeMinutes: 416, playTimePercentage: 8.9, rank: 8 },
    { id: 'a10', name: 'Olivia Rodrigo', imageUrl: getPlaceholderImageUrl(10), playCount: 97, playTimeMinutes: 388, playTimePercentage: 8.3, rank: 9 },
    { id: 'a9', name: 'Tyler, The Creator', imageUrl: getPlaceholderImageUrl(9), playCount: 86, playTimeMinutes: 344, playTimePercentage: 7.4, rank: 10 },
    { id: 'a12', name: 'Frank Ocean', imageUrl: getPlaceholderImageUrl(12), playCount: 78, playTimeMinutes: 312, playTimePercentage: 6.7, rank: 11 },
    { id: 'a16', name: 'Dua Lipa', imageUrl: getPlaceholderImageUrl(16), playCount: 72, playTimeMinutes: 288, playTimePercentage: 6.2, rank: 12 },
    { id: 'a13', name: 'Ariana Grande', imageUrl: getPlaceholderImageUrl(13), playCount: 67, playTimeMinutes: 268, playTimePercentage: 5.8, rank: 13 },
    { id: 'a11', name: 'Lana Del Rey', imageUrl: getPlaceholderImageUrl(11), playCount: 64, playTimeMinutes: 256, playTimePercentage: 5.5, rank: 14 },
    { id: 'a15', name: 'Travis Scott', imageUrl: getPlaceholderImageUrl(15), playCount: 59, playTimeMinutes: 236, playTimePercentage: 5.1, rank: 15 },
    { id: 'a14', name: 'Beyoncé', imageUrl: getPlaceholderImageUrl(14), playCount: 56, playTimeMinutes: 224, playTimePercentage: 4.8, rank: 16 },
    { id: 'a17', name: 'Harry Styles', imageUrl: getPlaceholderImageUrl(17), playCount: 48, playTimeMinutes: 192, playTimePercentage: 4.1, rank: 17 },
    { id: 'a18', name: 'The 1975', imageUrl: getPlaceholderImageUrl(18), playCount: 42, playTimeMinutes: 168, playTimePercentage: 3.6, rank: 18 },
    { id: 'a21', name: 'Childish Gambino', imageUrl: getPlaceholderImageUrl(21), playCount: 38, playTimeMinutes: 152, playTimePercentage: 3.3, rank: 19 },
    { id: 'a20', name: 'Post Malone', imageUrl: getPlaceholderImageUrl(20), playCount: 35, playTimeMinutes: 140, playTimePercentage: 3.0, rank: 20 },
  ],
  
  topArtistsLastYear: [
    { id: 'a1', name: 'Taylor Swift', imageUrl: getPlaceholderImageUrl(1), playCount: 876, playTimeMinutes: 3504, playTimePercentage: 23.8, rank: 1 },
    { id: 'a2', name: 'The Weeknd', imageUrl: getPlaceholderImageUrl(2), playCount: 789, playTimeMinutes: 3156, playTimePercentage: 21.5, rank: 2 },
    { id: 'a3', name: 'Billie Eilish', imageUrl: getPlaceholderImageUrl(3), playCount: 654, playTimeMinutes: 2616, playTimePercentage: 17.8, rank: 3 },
    { id: 'a4', name: 'Drake', imageUrl: getPlaceholderImageUrl(4), playCount: 583, playTimeMinutes: 2332, playTimePercentage: 15.9, rank: 4 },
    { id: 'a8', name: 'Bad Bunny', imageUrl: getPlaceholderImageUrl(8), playCount: 478, playTimeMinutes: 1912, playTimePercentage: 13.0, rank: 5 },
    { id: 'a6', name: 'Kendrick Lamar', imageUrl: getPlaceholderImageUrl(6), playCount: 398, playTimeMinutes: 1592, playTimePercentage: 10.8, rank: 6 },
    { id: 'a16', name: 'Dua Lipa', imageUrl: getPlaceholderImageUrl(16), playCount: 345, playTimeMinutes: 1380, playTimePercentage: 9.4, rank: 7 },
    { id: 'a5', name: 'Doja Cat', imageUrl: getPlaceholderImageUrl(5), playCount: 321, playTimeMinutes: 1284, playTimePercentage: 8.7, rank: 8 },
    { id: 'a12', name: 'Frank Ocean', imageUrl: getPlaceholderImageUrl(12), playCount: 287, playTimeMinutes: 1148, playTimePercentage: 7.8, rank: 9 },
    { id: 'a7', name: 'SZA', imageUrl: getPlaceholderImageUrl(7), playCount: 267, playTimeMinutes: 1068, playTimePercentage: 7.3, rank: 10 },
    { id: 'a10', name: 'Olivia Rodrigo', imageUrl: getPlaceholderImageUrl(10), playCount: 243, playTimeMinutes: 972, playTimePercentage: 6.6, rank: 11 },
    { id: 'a14', name: 'Beyoncé', imageUrl: getPlaceholderImageUrl(14), playCount: 234, playTimeMinutes: 936, playTimePercentage: 6.4, rank: 12 },
    { id: 'a17', name: 'Harry Styles', imageUrl: getPlaceholderImageUrl(17), playCount: 219, playTimeMinutes: 876, playTimePercentage: 6.0, rank: 13 },
    { id: 'a9', name: 'Tyler, The Creator', imageUrl: getPlaceholderImageUrl(9), playCount: 198, playTimeMinutes: 792, playTimePercentage: 5.4, rank: 14 },
    { id: 'a22', name: 'Tame Impala', imageUrl: getPlaceholderImageUrl(22), playCount: 176, playTimeMinutes: 704, playTimePercentage: 4.8, rank: 15 },
    { id: 'a13', name: 'Ariana Grande', imageUrl: getPlaceholderImageUrl(13), playCount: 165, playTimeMinutes: 660, playTimePercentage: 4.5, rank: 16 },
    { id: 'a11', name: 'Lana Del Rey', imageUrl: getPlaceholderImageUrl(11), playCount: 154, playTimeMinutes: 616, playTimePercentage: 4.2, rank: 17 },
    { id: 'a20', name: 'Post Malone', imageUrl: getPlaceholderImageUrl(20), playCount: 145, playTimeMinutes: 580, playTimePercentage: 3.9, rank: 18 },
    { id: 'a15', name: 'Travis Scott', imageUrl: getPlaceholderImageUrl(15), playCount: 134, playTimeMinutes: 536, playTimePercentage: 3.6, rank: 19 },
    { id: 'a23', name: 'Fleetwood Mac', imageUrl: getPlaceholderImageUrl(23), playCount: 128, playTimeMinutes: 512, playTimePercentage: 3.5, rank: 20 },
  ],

  // Top Songs
  topSongsLastMonth: [
    { id: 's1', name: 'Cruel Summer', imageUrl: getPlaceholderImageUrl(101), playCount: 47, playTimeMinutes: 164, playTimePercentage: 21.5, rank: 1 },
    { id: 's2', name: 'Blinding Lights', imageUrl: getPlaceholderImageUrl(102), playCount: 38, playTimeMinutes: 144, playTimePercentage: 18.9, rank: 2 },
    { id: 's3', name: 'Happier Than Ever', imageUrl: getPlaceholderImageUrl(103), playCount: 34, playTimeMinutes: 148, playTimePercentage: 19.4, rank: 3 },
    { id: 's4', name: 'Rich Flex', imageUrl: getPlaceholderImageUrl(104), playCount: 31, playTimeMinutes: 108, playTimePercentage: 14.1, rank: 4 },
    { id: 's5', name: 'Paint The Town Red', imageUrl: getPlaceholderImageUrl(105), playCount: 28, playTimeMinutes: 105, playTimePercentage: 13.8, rank: 5 },
    { id: 's6', name: 'HUMBLE.', imageUrl: getPlaceholderImageUrl(106), playCount: 23, playTimeMinutes: 80, playTimePercentage: 10.5, rank: 6 },
    { id: 's7', name: 'Kill Bill', imageUrl: getPlaceholderImageUrl(107), playCount: 19, playTimeMinutes: 67, playTimePercentage: 8.8, rank: 7 },
    { id: 's8', name: 'Tití Me Preguntó', imageUrl: getPlaceholderImageUrl(108), playCount: 18, playTimeMinutes: 63, playTimePercentage: 8.3, rank: 8 },
    { id: 's9', name: 'NEW MAGIC WAND', imageUrl: getPlaceholderImageUrl(109), playCount: 15, playTimeMinutes: 53, playTimePercentage: 6.9, rank: 9 },
    { id: 's10', name: 'vampire', imageUrl: getPlaceholderImageUrl(110), playCount: 14, playTimeMinutes: 49, playTimePercentage: 6.4, rank: 10 },
    { id: 's11', name: 'Summertime Sadness', imageUrl: getPlaceholderImageUrl(111), playCount: 12, playTimeMinutes: 44, playTimePercentage: 5.8, rank: 11 },
    { id: 's12', name: 'White Ferrari', imageUrl: getPlaceholderImageUrl(112), playCount: 11, playTimeMinutes: 41, playTimePercentage: 5.4, rank: 12 },
    { id: 's13', name: '7 rings', imageUrl: getPlaceholderImageUrl(113), playCount: 10, playTimeMinutes: 37, playTimePercentage: 4.8, rank: 13 },
    { id: 's14', name: 'CUFF IT', imageUrl: getPlaceholderImageUrl(114), playCount: 9, playTimeMinutes: 34, playTimePercentage: 4.5, rank: 14 },
    { id: 's15', name: 'SICKO MODE', imageUrl: getPlaceholderImageUrl(115), playCount: 8, playTimeMinutes: 30, playTimePercentage: 3.9, rank: 15 },
    { id: 's16', name: "Don't Start Now", imageUrl: getPlaceholderImageUrl(116), playCount: 7, playTimeMinutes: 26, playTimePercentage: 3.4, rank: 16 },
    { id: 's17', name: 'As It Was', imageUrl: getPlaceholderImageUrl(117), playCount: 6, playTimeMinutes: 23, playTimePercentage: 3.0, rank: 17 },
    { id: 's18', name: 'Somebody Else', imageUrl: getPlaceholderImageUrl(118), playCount: 5, playTimeMinutes: 19, playTimePercentage: 2.5, rank: 18 },
    { id: 's19', name: 'DESPECHÁ', imageUrl: getPlaceholderImageUrl(119), playCount: 4, playTimeMinutes: 15, playTimePercentage: 2.0, rank: 19 },
    { id: 's20', name: 'rockstar', imageUrl: getPlaceholderImageUrl(120), playCount: 3, playTimeMinutes: 12, playTimePercentage: 1.6, rank: 20 },
  ],
  
  topSongsLast90Days: [
    { id: 's2', name: 'Blinding Lights', imageUrl: getPlaceholderImageUrl(102), playCount: 98, playTimeMinutes: 372, playTimePercentage: 19.8, rank: 1 },
    { id: 's1', name: 'Cruel Summer', imageUrl: getPlaceholderImageUrl(101), playCount: 89, playTimeMinutes: 311, playTimePercentage: 16.6, rank: 2 },
    { id: 's3', name: 'Happier Than Ever', imageUrl: getPlaceholderImageUrl(103), playCount: 78, playTimeMinutes: 340, playTimePercentage: 18.1, rank: 3 },
    { id: 's4', name: 'Rich Flex', imageUrl: getPlaceholderImageUrl(104), playCount: 67, playTimeMinutes: 234, playTimePercentage: 12.5, rank: 4 },
    { id: 's6', name: 'HUMBLE.', imageUrl: getPlaceholderImageUrl(106), playCount: 59, playTimeMinutes: 206, playTimePercentage: 11.0, rank: 5 },
    { id: 's5', name: 'Paint The Town Red', imageUrl: getPlaceholderImageUrl(105), playCount: 54, playTimeMinutes: 202, playTimePercentage: 10.8, rank: 6 },
    { id: 's8', name: 'Tití Me Preguntó', imageUrl: getPlaceholderImageUrl(108), playCount: 47, playTimeMinutes: 164, playTimePercentage: 8.7, rank: 7 },
    { id: 's7', name: 'Kill Bill', imageUrl: getPlaceholderImageUrl(107), playCount: 41, playTimeMinutes: 143, playTimePercentage: 7.6, rank: 8 },
    { id: 's10', name: 'vampire', imageUrl: getPlaceholderImageUrl(110), playCount: 36, playTimeMinutes: 126, playTimePercentage: 6.7, rank: 9 },
    { id: 's9', name: 'NEW MAGIC WAND', imageUrl: getPlaceholderImageUrl(109), playCount: 32, playTimeMinutes: 112, playTimePercentage: 6.0, rank: 10 },
    { id: 's12', name: 'White Ferrari', imageUrl: getPlaceholderImageUrl(112), playCount: 29, playTimeMinutes: 108, playTimePercentage: 5.8, rank: 11 },
    { id: 's16', name: "Don't Start Now", imageUrl: getPlaceholderImageUrl(116), playCount: 26, playTimeMinutes: 97, playTimePercentage: 5.2, rank: 12 },
    { id: 's13', name: '7 rings', imageUrl: getPlaceholderImageUrl(113), playCount: 23, playTimeMinutes: 85, playTimePercentage: 4.5, rank: 13 },
    { id: 's11', name: 'Summertime Sadness', imageUrl: getPlaceholderImageUrl(111), playCount: 21, playTimeMinutes: 77, playTimePercentage: 4.1, rank: 14 },
    { id: 's15', name: 'SICKO MODE', imageUrl: getPlaceholderImageUrl(115), playCount: 19, playTimeMinutes: 71, playTimePercentage: 3.8, rank: 15 },
    { id: 's14', name: 'CUFF IT', imageUrl: getPlaceholderImageUrl(114), playCount: 18, playTimeMinutes: 68, playTimePercentage: 3.6, rank: 16 },
    { id: 's17', name: 'As It Was', imageUrl: getPlaceholderImageUrl(117), playCount: 15, playTimeMinutes: 57, playTimePercentage: 3.0, rank: 17 },
    { id: 's18', name: 'Somebody Else', imageUrl: getPlaceholderImageUrl(118), playCount: 13, playTimeMinutes: 49, playTimePercentage: 2.6, rank: 18 },
    { id: 's21', name: 'Lost in Yesterday', imageUrl: getPlaceholderImageUrl(121), playCount: 11, playTimeMinutes: 42, playTimePercentage: 2.2, rank: 19 },
    { id: 's20', name: 'rockstar', imageUrl: getPlaceholderImageUrl(120), playCount: 9, playTimeMinutes: 35, playTimePercentage: 1.9, rank: 20 },
  ],
  
  topSongsLastYear: [
    { id: 's1', name: 'Cruel Summer', imageUrl: getPlaceholderImageUrl(101), playCount: 231, playTimeMinutes: 808, playTimePercentage: 18.9, rank: 1 },
    { id: 's2', name: 'Blinding Lights', imageUrl: getPlaceholderImageUrl(102), playCount: 214, playTimeMinutes: 813, playTimePercentage: 19.0, rank: 2 },
    { id: 's3', name: 'Happier Than Ever', imageUrl: getPlaceholderImageUrl(103), playCount: 187, playTimeMinutes: 815, playTimePercentage: 19.1, rank: 3 },
    { id: 's8', name: 'Tití Me Preguntó', imageUrl: getPlaceholderImageUrl(108), playCount: 154, playTimeMinutes: 539, playTimePercentage: 12.6, rank: 4 },
    { id: 's4', name: 'Rich Flex', imageUrl: getPlaceholderImageUrl(104), playCount: 142, playTimeMinutes: 497, playTimePercentage: 11.6, rank: 5 },
    { id: 's6', name: 'HUMBLE.', imageUrl: getPlaceholderImageUrl(106), playCount: 128, playTimeMinutes: 448, playTimePercentage: 10.5, rank: 6 },
    { id: 's16', name: "Don't Start Now", imageUrl: getPlaceholderImageUrl(116), playCount: 112, playTimeMinutes: 420, playTimePercentage: 9.8, rank: 7 },
    { id: 's12', name: 'White Ferrari', imageUrl: getPlaceholderImageUrl(112), playCount: 98, playTimeMinutes: 367, playTimePercentage: 8.6, rank: 8 },
    { id: 's5', name: 'Paint The Town Red', imageUrl: getPlaceholderImageUrl(105), playCount: 87, playTimeMinutes: 326, playTimePercentage: 7.6, rank: 9 },
    { id: 's14', name: 'CUFF IT', imageUrl: getPlaceholderImageUrl(114), playCount: 76, playTimeMinutes: 286, playTimePercentage: 6.7, rank: 10 },
    { id: 's17', name: 'As It Was', imageUrl: getPlaceholderImageUrl(117), playCount: 68, playTimeMinutes: 258, playTimePercentage: 6.0, rank: 11 },
    { id: 's7', name: 'Kill Bill', imageUrl: getPlaceholderImageUrl(107), playCount: 64, playTimeMinutes: 224, playTimePercentage: 5.2, rank: 12 },
    { id: 's9', name: 'NEW MAGIC WAND', imageUrl: getPlaceholderImageUrl(109), playCount: 56, playTimeMinutes: 196, playTimePercentage: 4.6, rank: 13 },
    { id: 's22', name: 'The Less I Know The Better', imageUrl: getPlaceholderImageUrl(122), playCount: 48, playTimeMinutes: 172, playTimePercentage: 4.0, rank: 14 },
    { id: 's13', name: '7 rings', imageUrl: getPlaceholderImageUrl(113), playCount: 42, playTimeMinutes: 155, playTimePercentage: 3.6, rank: 15 },
    { id: 's11', name: 'Summertime Sadness', imageUrl: getPlaceholderImageUrl(111), playCount: 38, playTimeMinutes: 140, playTimePercentage: 3.3, rank: 16 },
    { id: 's20', name: 'rockstar', imageUrl: getPlaceholderImageUrl(120), playCount: 34, playTimeMinutes: 128, playTimePercentage: 3.0, rank: 17 },
    { id: 's15', name: 'SICKO MODE', imageUrl: getPlaceholderImageUrl(115), playCount: 31, playTimeMinutes: 116, playTimePercentage: 2.7, rank: 18 },
    { id: 's23', name: 'Dreams', imageUrl: getPlaceholderImageUrl(123), playCount: 28, playTimeMinutes: 107, playTimePercentage: 2.5, rank: 19 },
    { id: 's10', name: 'vampire', imageUrl: getPlaceholderImageUrl(110), playCount: 25, playTimeMinutes: 95, playTimePercentage: 2.2, rank: 20 },
  ],

  topAlbumsLastMonth: [
    {
      id: "album1",
      name: "Midnights",
      imageUrl: "/albums/midnights.jpg",
      playCount: 87,
      playTimeMinutes: 348,
      playTimePercentage: 28.5,
      rank: 1
    },
    {
      id: "album2",
      name: "Blonde",
      imageUrl: "/albums/blonde.jpg",
      playCount: 62,
      playTimeMinutes: 279,
      playTimePercentage: 22.8,
      rank: 2
    },
    {
      id: "album3",
      name: "DAMN.",
      imageUrl: "/albums/damn.jpg",
      playCount: 45,
      playTimeMinutes: 189,
      playTimePercentage: 15.5,
      rank: 3
    },
    {
      id: "album4",
      name: "Dawn FM",
      imageUrl: "/albums/dawnfm.jpg",
      playCount: 38,
      playTimeMinutes: 152,
      playTimePercentage: 12.4,
      rank: 4
    },
    {
      id: "album5",
      name: "Harry's House",
      imageUrl: "/albums/harryshouse.jpg",
      playCount: 29,
      playTimeMinutes: 130,
      playTimePercentage: 10.6,
      rank: 5
    },
    {
      id: "album6",
      name: "Renaissance",
      imageUrl: "/albums/renaissance.jpg",
      playCount: 18,
      playTimeMinutes: 90,
      playTimePercentage: 7.4,
      rank: 6
    },
    {
      id: "album7",
      name: "SOS",
      imageUrl: "/albums/sos.jpg",
      playCount: 10,
      playTimeMinutes: 35,
      playTimePercentage: 2.8,
      rank: 7
    }
  ],
  
  topAlbumsLast90Days: [
    {
      id: "album2",
      name: "Blonde",
      imageUrl: "/albums/blonde.jpg",
      playCount: 198,
      playTimeMinutes: 891,
      playTimePercentage: 22.3,
      rank: 1
    },
    {
      id: "album1",
      name: "Midnights",
      imageUrl: "/albums/midnights.jpg",
      playCount: 180,
      playTimeMinutes: 720,
      playTimePercentage: 18.0,
      rank: 2
    },
    {
      id: "album8",
      name: "For All The Dogs",
      imageUrl: "/albums/forthedogs.jpg",
      playCount: 156,
      playTimeMinutes: 702,
      playTimePercentage: 17.6,
      rank: 3
    },
    {
      id: "album3",
      name: "DAMN.",
      imageUrl: "/albums/damn.jpg",
      playCount: 142,
      playTimeMinutes: 596,
      playTimePercentage: 14.9,
      rank: 4
    },
    {
      id: "album5",
      name: "Harry's House",
      imageUrl: "/albums/harryshouse.jpg",
      playCount: 98,
      playTimeMinutes: 441,
      playTimePercentage: 11.0,
      rank: 5
    },
    {
      id: "album4",
      name: "Dawn FM",
      imageUrl: "/albums/dawnfm.jpg",
      playCount: 89,
      playTimeMinutes: 356,
      playTimePercentage: 8.9,
      rank: 6
    },
    {
      id: "album6",
      name: "Renaissance",
      imageUrl: "/albums/renaissance.jpg",
      playCount: 45,
      playTimeMinutes: 225,
      playTimePercentage: 5.6,
      rank: 7
    },
    {
      id: "album9",
      name: "The Rise and Fall of Ziggy Stardust",
      imageUrl: "/albums/ziggy.jpg",
      playCount: 12,
      playTimeMinutes: 48,
      playTimePercentage: 1.2,
      rank: 8
    },
    {
      id: "album10",
      name: "American Idiot",
      imageUrl: "/albums/americanidiot.jpg",
      playCount: 8,
      playTimeMinutes: 20,
      playTimePercentage: 0.5,
      rank: 9
    }
  ],
  
  topAlbumsLastYear: [
    {
      id: "album8",
      name: "For All The Dogs",
      imageUrl: "/albums/forthedogs.jpg",
      playCount: 492,
      playTimeMinutes: 2214,
      playTimePercentage: 18.6,
      rank: 1
    },
    {
      id: "album2",
      name: "Blonde",
      imageUrl: "/albums/blonde.jpg",
      playCount: 423,
      playTimeMinutes: 1903,
      playTimePercentage: 16.0,
      rank: 2
    },
    {
      id: "album11",
      name: "Ultraviolence",
      imageUrl: "/albums/ultraviolence.jpg",
      playCount: 387,
      playTimeMinutes: 1741,
      playTimePercentage: 14.6,
      rank: 3
    },
    {
      id: "album1",
      name: "Midnights",
      imageUrl: "/albums/midnights.jpg",
      playCount: 356,
      playTimeMinutes: 1424,
      playTimePercentage: 12.0,
      rank: 4
    },
    {
      id: "album12",
      name: "Flower Boy",
      imageUrl: "/albums/flowerboy.jpg",
      playCount: 289,
      playTimeMinutes: 1300,
      playTimePercentage: 10.9,
      rank: 5
    },
    {
      id: "album3",
      name: "DAMN.",
      imageUrl: "/albums/damn.jpg",
      playCount: 247,
      playTimeMinutes: 1037,
      playTimePercentage: 8.7,
      rank: 6
    },
    {
      id: "album13",
      name: "KID A",
      imageUrl: "/albums/kida.jpg",
      playCount: 201,
      playTimeMinutes: 905,
      playTimePercentage: 7.6,
      rank: 7
    },
    {
      id: "album5",
      name: "Harry's House",
      imageUrl: "/albums/harryshouse.jpg",
      playCount: 178,
      playTimeMinutes: 801,
      playTimePercentage: 6.7,
      rank: 8
    },
    {
      id: "album14",
      name: "Endless Summer",
      imageUrl: "/albums/endlesssummer.jpg",
      playCount: 124,
      playTimeMinutes: 496,
      playTimePercentage: 4.2,
      rank: 9
    },
    {
      id: "album15",
      name: "In Rainbows",
      imageUrl: "/albums/inrainbows.jpg",
      playCount: 57,
      playTimeMinutes: 228,
      playTimePercentage: 1.9,
      rank: 10
    },
    {
      id: "album16",
      name: "The New Abnormal",
      imageUrl: "/albums/newabmormal.jpg",
      playCount: 42,
      playTimeMinutes: 210,
      playTimePercentage: 1.8,
      rank: 11
    },
    {
      id: "album17",
      name: "Thriller",
      imageUrl: "/albums/thriller.jpg",
      playCount: 33,
      playTimeMinutes: 165,
      playTimePercentage: 1.4,
      rank: 12 
    },
    { id: "album18", name: "OK Computer", imageUrl: "/albums/okcomputer.jpg", playCount: 27, playTimeMinutes: 121,  playTimePercentage: 1.0, rank: 13 },
    { id: "album19", name: "Melodrama", imageUrl: "/albums/melodrama.jpg", playCount: 21, playTimeMinutes: 94, playTimePercentage: 0.8, rank: 14 },
    { id: "album20", name: "After Hours", imageUrl: "/albums/afterhours.jpg", playCount: 18, playTimeMinutes: 80, playTimePercentage: 0.7, rank: 15 }
    ]
}