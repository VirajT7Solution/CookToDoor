import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import type { Category } from '../../types/menuItem.types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: number;
  onCategorySelect: (categoryId?: number) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
}) => {
  const theme = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        gap: theme.spacing(1.5),
        overflowX: 'auto',
        padding: `${theme.spacing(1)} 0`,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      className="category-filter"
    >
      {/* All Categories */}
      <button
        onClick={() => onCategorySelect(undefined)}
        style={{
          padding: `${theme.spacing(1)} ${theme.spacing(2.5)}`,
          backgroundColor:
            selectedCategoryId === undefined
              ? theme.colors.primary
              : theme.colors.white,
          color:
            selectedCategoryId === undefined
              ? theme.colors.white
              : theme.colors.text,
          border: `2px solid ${
            selectedCategoryId === undefined
              ? theme.colors.primary
              : theme.colors.border
          }`,
          borderRadius: theme.radius.full,
          fontSize: theme.font.size.sm,
          fontWeight:
            selectedCategoryId === undefined
              ? theme.font.weight.semibold
              : theme.font.weight.medium,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: theme.transitions.base,
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          if (selectedCategoryId !== undefined) {
            e.currentTarget.style.borderColor = theme.colors.primary;
            e.currentTarget.style.color = theme.colors.primary;
          }
        }}
        onMouseLeave={(e) => {
          if (selectedCategoryId !== undefined) {
            e.currentTarget.style.borderColor = theme.colors.border;
            e.currentTarget.style.color = theme.colors.text;
          }
        }}
      >
        All
      </button>

      {/* Category Chips */}
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            style={{
              padding: `${theme.spacing(1)} ${theme.spacing(2.5)}`,
              backgroundColor: isSelected ? theme.colors.primary : theme.colors.white,
              color: isSelected ? theme.colors.white : theme.colors.text,
              border: `2px solid ${
                isSelected ? theme.colors.primary : theme.colors.border
              }`,
              borderRadius: theme.radius.full,
              fontSize: theme.font.size.sm,
              fontWeight: isSelected
                ? theme.font.weight.semibold
                : theme.font.weight.medium,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: theme.transitions.base,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.color = theme.colors.primary;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.color = theme.colors.text;
              }
            }}
          >
            {category.categoryName}
          </button>
        );
      })}
      <style>{`
        .category-filter::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryFilter;

