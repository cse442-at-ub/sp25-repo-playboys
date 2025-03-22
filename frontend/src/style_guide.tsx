import React from 'react';
import { Button } from 'react-bootstrap';

// Color Palette
export const Colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#32cd32',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  background: '#f5f5f5',
};

// Typography
export const FontSizes = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '24px',
  display: '36px',
};

export const FontWeights = {
  normal: 400,
  bold: 700,
};

// Border radius
export const BorderRadius = {
  small: '6px',
  medium: '12px',
  large: '25px',
  round: '50%',
};

// Spacing
export const Spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

// Reusable Components

export const PrimaryButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <Button
    variant="primary"
    style={{
      padding: '12px',
      backgroundColor: Colors.success,
      borderRadius: BorderRadius.medium,
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      width: '100%',
    }}
    onClick={onClick}
  >
    {children}
  </Button>
);

export const SecondaryButton = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <Button
    variant="secondary"
    style={{
      padding: '12px',
      backgroundColor: Colors.secondary,
      borderRadius: BorderRadius.medium,
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.bold,
      width: '100%',
    }}
    onClick={onClick}
  >
    {children}
  </Button>
);

// Headings
export const Heading = ({ level, children }: { level?: number; children: React.ReactNode }) => {
  const Tag = `h${level || 1}` as keyof JSX.IntrinsicElements;
  return (
    <Tag style={{ fontWeight: FontWeights.bold, color: Colors.dark, marginBottom: Spacing.md }}>
      {children}
    </Tag>
  );
};

// Container
export const Container = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: Spacing.lg,
      backgroundColor: Colors.background,
      borderRadius: BorderRadius.medium,
      marginBottom: Spacing.lg,
    }}
  >
    {children}
  </div>
);

export default function StyleGuide() {
  return (
    <div style={{ padding: Spacing.lg }}>
      <Heading level={1}>🎨 Style Guide</Heading>
      <Heading level={2}>Colors</Heading>
      <div className="d-flex flex-wrap mb-4">
        {Object.entries(Colors).map(([key, value]) => (
          <div key={key} className="m-2 text-center">
            <div style={{ background: value, width: '80px', height: '80px', borderRadius: BorderRadius.small }}></div>
            <small>{key}</small>
          </div>
        ))}
      </div>

      <Heading level={2}>Buttons</Heading>
      <div className="d-flex flex-column gap-3">
        <PrimaryButton>Primary Button</PrimaryButton>
        <SecondaryButton>Secondary Button</SecondaryButton>
      </div>

      <Heading level={2}>Typography</Heading>
      {Object.entries(FontSizes).map(([key, size]) => (
        <p key={key} style={{ fontSize: size }}>
          {key} - {size}
        </p>
      ))}
    </div>
  );
}