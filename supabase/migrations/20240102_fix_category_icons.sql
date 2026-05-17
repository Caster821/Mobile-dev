-- Migration: Fix category icons from emojis to Ionicons names
-- This migration updates existing category icons that use emojis to proper Ionicons names

UPDATE categories SET icon = 'shield-checkmark' WHERE icon = '🛡️';
UPDATE categories SET icon = 'receipt' WHERE icon = '📋';
UPDATE categories SET icon = 'pin' WHERE icon = '📌';
UPDATE categories SET icon = 'fast-food' WHERE icon = '🍕';
UPDATE categories SET icon = 'car' WHERE icon = '🚗';
UPDATE categories SET icon = 'home' WHERE icon = '🏠';
UPDATE categories SET icon = 'bulb' WHERE icon = '💡';
UPDATE categories SET icon = 'medical' WHERE icon = '🏥';
UPDATE categories SET icon = 'film' WHERE icon = '🎬';
UPDATE categories SET icon = 'cart' WHERE icon = '🛍️';
UPDATE categories SET icon = 'book' WHERE icon = '📚';
UPDATE categories SET icon = 'cut' WHERE icon = '💇';
UPDATE categories SET icon = 'shirt' WHERE icon = '👕';
UPDATE categories SET icon = 'gift' WHERE icon = '🎁';
UPDATE categories SET icon = 'airplane' WHERE icon = '✈️';
UPDATE categories SET icon = 'cash' WHERE icon = '💰';
UPDATE categories SET icon = 'desktop' WHERE icon = '💻';
UPDATE categories SET icon = 'business' WHERE icon = '🏢';
UPDATE categories SET icon = 'trending-up' WHERE icon = '📈';
UPDATE categories SET icon = 'ribbon' WHERE icon = '🎀';
